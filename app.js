// app.js - User Panel Logic

const API_URL = 'http://localhost:3000';

// DOM Elements
const form = document.getElementById('listing-form');
const filterSelect = document.getElementById('filter-type');
const container = document.getElementById('listings-container');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');