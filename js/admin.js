const firebaseConfig = {
    apiKey: "AIzaSyBgmTKtgqKGKvR7tbjeq8V1LEAMmfQ76Uk",
    authDomain: "jlteamv2.firebaseapp.com",
    databaseURL: "https://jlteamv2-default-rtdb.firebaseio.com",
    projectId: "jlteamv2",
    storageBucket: "jlteamv2.appspot.com",
    messagingSenderId: "588273591772",
    appId: "1:588273591772:web:4848f7d80f68171a095b19"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

async function fetchOptions() {
    try {
        const citiesResponse = await fetch('js/cities.json');
        const servicesResponse = await fetch('js/services.json');
        const cities = await citiesResponse.json();
        const services = await servicesResponse.json();
        return { cities, services };
    } catch (error) {
        console.error('Error fetching JSON data:', error);
        // Optionally display an error message to the user
    }
}

// Function to populate dropdowns
async function populateDropdowns() {
    const { cities, services } = await fetchOptions(); // Destructure once

    const cityDropdown = document.getElementById('city-coverage');
    const serviceDropdown = document.getElementById('services');

    // Populate city dropdown from JSON
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.value;
        option.textContent = city.name;
        cityDropdown.appendChild(option);
    });

    // Populate service dropdown from JSON (assuming services are key-value pairs)
    Object.keys(services).forEach(service => {
        const option = document.createElement('option');
        option.value = service;
        option.textContent = services[service];
        serviceDropdown.appendChild(option);
    });
}
// Function to handle form submission
async function registerData(event) {
    event.preventDefault();

    // Get form values
    const companyName = $('#company-name').val();
    const selectedCities = $('#city-coverage').dropdown('get value'); // Assuming multi-select
    const selectedServices = $('#services').dropdown('get value'); // Assuming multi-select (array of values)
    const companyType = $('#company-type').dropdown('get value');
    const whatsappLink = $('#whatsapp-link').val();
    const adminNotes = $('#admin-notes').val();

    // Validation checks
    if (!companyName || !selectedCities.length || !selectedServices.length || !companyType) {
        $('.ui.error.message').text('Please fill in all required fields.').show();
        return; // Prevent submission
    }
    

    const companyData = {
        companyName,
        cityCoverage: selectedCities,
        services: selectedServices,
        companyType,
        whatsappLink,
        adminNotes
    };

    // Save to Firebase
    try {
        await database.ref('companies').push(companyData);

        // Show success message
        $('.ui.success.message').text('Company data registered successfully!').show();

        // Reset the form
        $('#company-form').form('clear');

        // Clear Fomantic UI dropdowns
        $('#city-coverage').dropdown('clear');
        $('#services').dropdown('clear');
        $('#company-type').dropdown('clear');

        // Hide messages after a delay
        setTimeout(() => {
            $('.ui.message').hide();
        }, 3000);
    } catch (error) {
        console.error('Error saving company data:', error);
        $('.ui.error.message').text('An error occurred while saving the data. Please try again.').show();
    }
}

// Initialize Fomantic UI form validation (similar to previous code)

// Initialize Fomantic UI elements
$(document).ready(function() {
    $('.ui.dropdown').dropdown(); // Initialize Fomantic UI dropdowns
});

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    await populateDropdowns();

    // Other event listeners and logic (similar to previous code)

    document.getElementById('submit-form').addEventListener('click', registerData);
});