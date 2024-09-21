const firebaseConfig = {
    apiKey: "AIzaSyBgmTKtgqKGKvR7tbjeq8V1LEAMmfQ76Uk",
    authDomain: "jlteamv2.firebaseapp.com",
    databaseURL: "https://jlteamv2-default-rtdb.firebaseio.com",
    projectId: "jlteamv2",
    storageBucket: "jlteamv2.appspot.com",
    messagingSenderId: "588273591772",
    appId: "1:588273591772:web:4848f7d80f68171a095b19"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to fetch cities and services from JSON files
async function fetchOptions() {
    const citiesResponse = await fetch('js/cities.json');
    const servicesResponse = await fetch('js/services.json');
    const cities = await citiesResponse.json();
    const services = await servicesResponse.json();
    return { cities, services };
}

// Function to fetch cities and services from Firebase
async function fetchCitiesAndServicesFromDB() {
    const citiesSnapshot = await database.ref('cities').once('value');
    const servicesSnapshot = await database.ref('services').once('value');

    const cities = [];
    const services = [];

    citiesSnapshot.forEach(city => {
        cities.push({ value: city.key, name: city.val().name });
    });

    servicesSnapshot.forEach(service => {
        services.push({ value: service.key, name: service.val().name });
    });

    return { cities, services };
}

// Function to populate dropdowns
async function populateDropdowns() {
    const { cities: jsonCities, services: jsonServices } = await fetchOptions();
    const { cities: dbCities, services: dbServices } = await fetchCitiesAndServicesFromDB();

    const cityDropdown = document.getElementById('city-coverage');
    const serviceDropdown = document.getElementById('services');
    const cityFilterDropdown = document.getElementById('city-filter');
    const serviceFilterDropdown = document.getElementById('service-filter');

    // Populate city dropdown from JSON
    jsonCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.value;
        option.textContent = city.name;
        cityDropdown.appendChild(option);
        cityFilterDropdown.appendChild(option.cloneNode(true)); // Clone the option for the filter dropdown
    });

    // Populate service dropdown from JSON
    Object.keys(jsonServices).forEach(service => {
        const option = document.createElement('option');
        option.value = service;
        option.textContent = jsonServices[service];
        serviceDropdown.appendChild(option);
        serviceFilterDropdown.appendChild(option.cloneNode(true)); // Clone the option for the filter dropdown
    });

    // Populate city dropdown from Firebase
    dbCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.value;
        option.textContent = city.name;
        cityDropdown.appendChild(option);
        cityFilterDropdown.appendChild(option.cloneNode(true)); // Clone the option for the filter dropdown
    });

    // Populate service dropdown from Firebase
    dbServices.forEach(service => {
        const option = document.createElement('option');
        option.value = service.value;
        option.textContent = service.name;
        serviceDropdown.appendChild(option);
        serviceFilterDropdown.appendChild(option.cloneNode(true)); // Clone the option for the filter dropdown
    });
}

// Function to initialize Fomantic UI elements
function initializeFomanticUI() {
    // Initialize dropdowns
    $('.ui.dropdown').dropdown();
}

// Function to handle form submission
async function registerData(event) {
    event.preventDefault();

    // Get form values
    const companyName = $('#company-name').val();
    const selectedCities = $('#city-coverage').dropdown('get value');
    const selectedServices = $('#services').dropdown('get value');
    const companyType = $('#company-type').dropdown('get value');
    const whatsappLink = $('#whatsapp-link').val();
    const adminNotes = $('#admin-notes').val();

    // Validation checks
    if (!companyName || selectedCities.length === 0 || selectedServices.length === 0 || !companyType) {
        $('.ui.error.message').text('Please fill in all required fields: Company Name, City Coverage, Services, and Company Type.').show();
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

    // Save to database
    try {
        await saveCompanyData(companyData);
        
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

// Initialize Fomantic UI form validation
$('#company-form').form({
    fields: {
        'company-name': 'empty', // Match the ID of the input field
        'city-coverage': 'empty', // Match the ID of the select field
        'services': 'empty', // Match the ID of the select field
        'company-type': 'empty' // Match the ID of the select field
    }
});

// Function to save company data
function saveCompanyData(companyData) {
    return database.ref('companies').push(companyData);
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    await populateDropdowns();
    initializeFomanticUI(); // Call the initialization function

    document.getElementById('submit-form').addEventListener('click', registerData);
});

