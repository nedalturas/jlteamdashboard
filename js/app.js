document.addEventListener('DOMContentLoaded', () => {
  fetchCitiesAndServices();
});

async function fetchCitiesAndServices() {
  try {
    // Fetch cities and services data
    const [citiesResponse, servicesResponse] = await Promise.all([
      fetch('js/cities.json'),
      fetch('js/services.json')
    ]);

    const cities = await citiesResponse.json();
    const services = await servicesResponse.json();

    // Populate the city coverage dropdown
    const cityDropdown = document.getElementById('city-coverage');
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city.value;
      option.textContent = city.name;
      cityDropdown.appendChild(option);
    });

    // Populate the services dropdown
    const serviceDropdown = document.getElementById('services');
    Object.keys(services).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = services[key];
      serviceDropdown.appendChild(option);
    });

    // Initialize Semantic UI dropdowns
    $('.ui.dropdown').dropdown();
  } catch (error) {
    console.error('Error fetching cities or services:', error);
  }
}