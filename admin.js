const API_URL = 'http://localhost:3000';

const tableBody = document.getElementById('admin-table-body');
const statsContainer = document.getElementById('stats-container');

async function loadAdminData() {
    try {
        const [groupsRes, tutorsRes] = await Promise.all([
            fetch(`${API_URL}/groups`),
            fetch(`${API_URL}/tutors`)
        ]);

        if (!groupsRes.ok || !tutorsRes.ok) {
            throw new Error('Failed to fetch admin data');
        }

        currentData.groups = await groupsRes.json();
        currentData.tutors = await tutorsRes.json();

        const groups = currentData.groups.map(g => ({ ...g, listingType: 'groups', displayTitle: g.title, displaySub: g.subject, displayTime: g.schedule, displayContact: g.contact }));
        const tutors = currentData.tutors.map(t => ({ ...t, listingType: 'tutors', displayTitle: t.name, displaySub: t.expertise, displayTime: t.availability, displayContact: t.email }));

        const allListings = [...groups, ...tutors];

        renderStats(allListings);
        renderTable(allListings);

    } catch (error) {
        console.error('Error loading admin data:', error);
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Failed to load data. Is JSON Server running?</td></tr>`;
    }
}

try {
        // Use PATCH to update only the provided fields
        const response = await fetch(`${API_URL}/${type}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to update listing');

        editModal.hide();
        await loadAdminData(); // Re-fetch and re-render to show updates

    } catch (error) {
        console.error('Update error:', error);
    }
}


async function deleteListing(id, type) {
    const isConfirmed = confirm('Are you sure you want to delete this listing? This action cannot be undone.');
    
    if (!isConfirmed) return;

    try {
        const response = await fetch(`${API_URL}/${type}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete listing');

        await loadAdminData(); 

    } catch (error) {
        console.error('Delete error:', error);
    }
}