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

    console.log('Cities fetched:', cities);
    console.log('Services fetched:', services);

    return { cities, services };
}

// Function to populate filter dropdowns
async function populateFilterDropdowns() {
    const { cities, services } = await fetchCitiesAndServicesFromDB();
    const cityFilterDropdown = document.getElementById('city-filter');
    const serviceFilterDropdown = document.getElementById('service-filter');

    // Clear existing options
    cityFilterDropdown.innerHTML = '<option value="">All Cities</option>';
    serviceFilterDropdown.innerHTML = '<option value="">All Services</option>';

    // Populate city filter dropdown
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.value;
        option.textContent = city.name;
        cityFilterDropdown.appendChild(option);
    });

    // Populate service filter dropdown
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.value;
        option.textContent = service.name;
        serviceFilterDropdown.appendChild(option);
    });

    console.log('Dropdowns populated');

    // Initialize Fomantic UI dropdowns
    $('.ui.dropdown').dropdown();
}


// Function to populate filter dropdowns
async function populateFilterDropdowns() {
    const { cities, services } = await fetchCitiesAndServicesFromDB();
    const cityFilterDropdown = document.getElementById('city-filter');
    const serviceFilterDropdown = document.getElementById('service-filter');

    // Populate city filter dropdown
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.value;
        option.textContent = city.name;
        cityFilterDropdown.appendChild(option);
    });

    // Populate service filter dropdown
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.value;
        option.textContent = service.name;
        serviceFilterDropdown.appendChild(option);
    });

    // Initialize Fomantic UI dropdowns
    $('.ui.dropdown').dropdown();
}

// Function to fetch company data from Firebase
async function fetchCompanyData() {
    const snapshot = await database.ref('companies').once('value');
    const companies = [];

    snapshot.forEach(childSnapshot => {
        companies.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
    });

    return companies;
}

// Function to populate the table with company data
function populateTable(companies) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    companies.forEach(company => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${company.companyName}</td>
            <td>${company.cityCoverage.join(', ')}</td>
            <td>${company.companyType}</td>
            <td>${company.services.join(', ')}</td>
            <td class="actions">
                <button class="ui mini blue icon button view-details" data-id="${company.id}"><i class="eye icon"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners to view buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => viewCompanyDetails(button.getAttribute('data-id')));
    });
}

// Function to view company details (placeholder)
function viewCompanyDetails(companyId) {
    console.log(`Viewing details for company with ID: ${companyId}`);
    // Implement the logic to show company details, e.g., in a modal
}

// Function to handle search and filtering
function handleSearchAndFilter() {
    const searchInput = document.querySelector('input[type="text"]');
    const cityFilter = document.getElementById('city-filter');
    const serviceFilter = document.getElementById('service-filter');

    const filterCompanies = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCity = cityFilter.value;
        const selectedService = serviceFilter.value;

        fetchCompanyData().then(companies => {
            const filteredCompanies = companies.filter(company => {
                const matchesSearch = company.companyName.toLowerCase().includes(searchTerm);
                const matchesCity = selectedCity === '' || company.cityCoverage.includes(selectedCity);
                const matchesService = selectedService === '' || company.services.includes(selectedService);
                return matchesSearch && matchesCity && matchesService;
            });
            populateTable(filteredCompanies);
        });
    };

    searchInput.addEventListener('input', filterCompanies);
    cityFilter.addEventListener('change', filterCompanies);
    serviceFilter.addEventListener('change', filterCompanies);
}

// // Initialize the page
// document.addEventListener('DOMContentLoaded', async () => {
//     await populateFilterDropdowns();
//     const companies = await fetchCompanyData();
//     populateTable(companies);
//     handleSearchAndFilter();
// });