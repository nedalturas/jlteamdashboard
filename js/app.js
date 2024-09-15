window.onload = function () {
    fetch('js/cities.json')
      .then((response) => response.json())
      .then((data) => {
        populateCities(data);
        initializeDropdown();
      })
      .catch((error) => console.error('Error fetching city data:', error));
  
    function populateCities(cities) {
      const dropdown = document.getElementById('city-coverage');
      for (const key in cities) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = cities[key];
        dropdown.appendChild(option);
      }
    }
  
    fetch('js/services.json')
      .then((response) => response.json())
      .then((data) => {
        populateServices(data);
      })
      .catch((error) => console.error('Error fetching services data:', error));
  
    function populateServices(services) {
      const dropdown = document.getElementById('services');
      for (const key in services) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = services[key];
        dropdown.appendChild(option);
      }
    }
  
    function initializeDropdown() {
      // Initialize Semantic UI dropdown with multiple selection
      $('.ui.dropdown').dropdown({
        allowAdditions: true,
        on: 'hover',
      });
    }
  
    // Initialize tabs
    $('.menu .item').tab();
};
  