const API_URL = "http://localhost:3000";

const form = document.getElementById("listing-form");
const filterSelect = document.getElementById("filter-type");
const container = document.getElementById("listings-container");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");

let activeFilter = "all";

async function loadListings() {
  try {
    let groups = [];
    let tutors = [];

    if (activeFilter === "all" || activeFilter === "groups") {
      const groupsRes = await fetch(`${API_URL}/groups`);

      if (groupsRes.ok) {
        groups = await groupsRes.json();

        groups = groups
          .filter((g) => g.status === "Active")
          .map((g) => ({
            listingType: "groups",
            title: g.title,
            subject: g.subject,
            schedule: g.schedule,
            contact: g.contact,
          }));
      }
    }

    if (activeFilter === "all" || activeFilter === "tutors") {
      const tutorsRes = await fetch(`${API_URL}/tutors`);

      if (tutorsRes.ok) {
        tutors = await tutorsRes.json();

        tutors = tutors
          .filter((t) => t.status === "Active")
          .map((t) => ({
            listingType: "tutors",
            title: t.name,
            subject: t.expertise,
            schedule: t.availability,
            contact: t.email,
          }));
      }
    }

    const listings = [...groups, ...tutors];

    renderListings(listings);
  } catch (error) {
    console.error(error);
    errorState.classList.remove("d-none");
  }
}

function renderListings(listings) {
  container.innerHTML = "";

  if (listings.length === 0) {
    container.innerHTML = `
            <div class="col-12 text-center">
                No Active Listings Found
            </div>
        `;
    return;
  }

  listings.forEach(function (item) {
    const col = document.createElement("div");
    col.className = "col";

    const badge = item.listingType === "groups" ? "Study Group" : "Peer Tutor";

    col.innerHTML = `
            <div class="card h-100 bg-dark border-0 shadow-sm">
                <div class="card-body">

                    <div class="d-flex justify-content-between mb-3">
                        <h5 class="custom-text-gold">
                            ${item.title}
                        </h5>

                        <span class="badge custom-btn-purple">
                            ${badge}
                        </span>
                    </div>

                    <p class="text-light">
                        <strong>Subject:</strong>
                        ${item.subject}
                    </p>

                    <p class="text-light">
                        <strong>Schedule:</strong>
                        ${item.schedule}
                    </p>

                </div>

                <div class="card-footer bg-transparent">
                    <small>
                        Contact:
                        <a href="mailto:${item.contact}">
                            ${item.contact}
                        </a>
                    </small>
                </div>
            </div>
        `;

    container.appendChild(col);
  });
}

filterSelect.addEventListener("change", function () {
  activeFilter = filterSelect.value;
  loadListings();
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const type = document.getElementById("listing-type").value;

  let data = {};

  if (type === "groups") {
    data = {
      title: document.getElementById("listing-title").value.trim(),
      subject: document.getElementById("listing-subject").value.trim(),
      schedule: document.getElementById("listing-schedule").value.trim(),
      contact: document.getElementById("listing-contact").value.trim(),
      status: "Active",
    };
  } else {
    data = {
      name: document.getElementById("listing-title").value.trim(),
      expertise: document.getElementById("listing-subject").value.trim(),
      availability: document.getElementById("listing-schedule").value.trim(),
      email: document.getElementById("listing-contact").value.trim(),
      status: "Active",
    };
  }

  try {
    const response = await fetch(`${API_URL}/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Could not save listing");
    }

    form.reset();

    await loadListings();
  } catch (error) {
    console.error(error);

    errorState.classList.remove("d-none");

    setTimeout(function () {
      errorState.classList.add("d-none");
    }, 3000);
  }
});

loadListings();
