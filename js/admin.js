let servicesMap = {};

// Function to fetch and display companies in the admin table
function displayCompanies(filter = '', cityFilter = '', serviceFilter = '') {
  const tableBody = document.querySelector('.ui.table tbody');
  database.ref('companies').once('value', (snapshot) => {
    tableBody.innerHTML = ''; // Clear existing rows
    snapshot.forEach((childSnapshot) => {
      const company = childSnapshot.val();
      const cityMatch = cityFilter === '' || (Array.isArray(company.cityCoverage) && company.cityCoverage.includes(cityFilter)) || company.cityCoverage === cityFilter;
      const serviceMatch = serviceFilter === '' || (company.services && (
        (typeof company.services === 'string' && company.services.split(',').map(s => s.trim()).includes(serviceFilter)) ||
        (Array.isArray(company.services) && company.services.includes(serviceFilter))
      ));
      const nameMatch = company.name.toLowerCase().includes(filter.toLowerCase());

      if (cityMatch && serviceMatch && nameMatch) {
        const row = `
          <tr>
            <td>${company.name}</td>
            <td>${Array.isArray(company.cityCoverage) ? company.cityCoverage.join(', ') : company.cityCoverage}</td>
            <td>${formatServices(company.services)}</td>
            <td>
              <button class="ui mini blue icon button" onclick="viewCompany('${childSnapshot.key}')"><i class="eye icon"></i></button>
              <button class="ui mini red icon button" onclick="editCompany('${childSnapshot.key}')"><i class="pencil icon"></i></button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      }
    });
  });
}

function formatServices(services) {
  if (!services) return '';
  if (typeof services === 'string') {
    return services.split(',').map(s => servicesMap[s.trim()] || s.trim()).join(', ');
  }
  if (Array.isArray(services)) {
    return services.map(s => servicesMap[s] || s).join(', ');
  }
  return services;
}

// Function to view company details (placeholder)
function viewCompany(companyId) {
  console.log('Viewing company:', companyId);
  // Implement view functionality
}

// Function to edit company details (placeholder)
function editCompany(companyId) {
  console.log('Editing company:', companyId);
  // Implement edit functionality
}

// Function to populate dropdowns from the database
function populateDropdowns() {
  const citySelect = document.getElementById('city-filter');
  const serviceSelect = document.getElementById('service-filter');

  // Populate cities
  database.ref('companies').once('value', (snapshot) => {
    const cities = new Set();
    snapshot.forEach((childSnapshot) => {
      const company = childSnapshot.val();
      if (company.cityCoverage) {
        // If cityCoverage is an array, add all cities
        if (Array.isArray(company.cityCoverage)) {
          company.cityCoverage.forEach(city => cities.add(city));
        } else {
          cities.add(company.cityCoverage);
        }
      }
    });
    citySelect.innerHTML = '<option value="">All Cities</option>';
    Array.from(cities).sort().forEach((city) => {
      const option = new Option(city, city);
      citySelect.add(option);
    });
    if ($ && $.fn.dropdown) {
      $(citySelect).dropdown('refresh');
    }
  });

  database.ref('companies').once('value', (snapshot) => {
    const services = new Set();
    snapshot.forEach((childSnapshot) => {
      const company = childSnapshot.val();
      if (company.services) {
        // If services is an array, add all services
        if (Array.isArray(company.services)) {
          company.services.forEach(service => services.add(service));
        } else {
          services.add(company.services);
        }
      }
    });
    serviceSelect.innerHTML = '<option value="">All Services</option>';
    Array.from(services).sort().forEach((service) => {
      const option = new Option(service, service);
      serviceSelect.add(option);
    });
    if ($ && $.fn.dropdown) {
      $(serviceSelect).dropdown('refresh');
    }
  });


  // Fetch services from services.json
  fetch('js/services.json')
    .then(response => response.json())
    .then(data => {
      servicesMap = data;
      serviceSelect.innerHTML = '<option value="">All Services</option>';
      Object.entries(data).forEach(([key, value]) => {
        const option = new Option(value, key);
        serviceSelect.add(option);
      });
      if ($ && $.fn.dropdown) {
        $(serviceSelect).dropdown('refresh');
      }
    })
    .catch(error => console.error('Error loading services:', error));
}

// Event listener to initialize admin functionalities
document.addEventListener('DOMContentLoaded', () => {
  populateDropdowns();
  displayCompanies(); // Initially display all companies

  // Add event listener for search input
  const searchInput = document.querySelector('.ui.input input');
  searchInput.addEventListener('input', () => {
    applyFilters();
  });

  // Add event listeners for dropdown filters
  const cityFilter = document.getElementById('city-filter');
  const serviceFilter = document.getElementById('service-filter');

  cityFilter.addEventListener('change', applyFilters);
  serviceFilter.addEventListener('change', applyFilters);
});

// Function to apply filters
function applyFilters() {
  const cityFilter = document.getElementById('city-filter').value;
  const serviceFilter = document.getElementById('service-filter').value;
  const searchInput = document.querySelector('.ui.input input').value;

  displayCompanies(searchInput, cityFilter, serviceFilter);
}
