function populateDropdowns() {
  // Fetch cities from cities.json
  fetch('js/cities.json')
    .then(response => response.json())
    .then(data => {
      const citySelect = document.getElementById('city-coverage');
      if (Array.isArray(data)) {
        data.forEach(city => {
          const option = new Option(city.name, city.id);
          citySelect.add(option);
        });
      } else {
        console.error('Cities data is not an array:', data);
      }
      if ($ && $.fn.dropdown) {
        $(citySelect).dropdown('refresh');
      }
    })
    .catch(error => console.error('Error loading cities:', error));

  // Fetch services from services.json
  fetch('js/services.json')
    .then(response => response.json())
    .then(data => {
      const serviceSelect = document.getElementById('services');
      // Clear existing options
      serviceSelect.innerHTML = '';
      
      // Add "All Services" option
      const allServicesOption = new Option('All Services', '');
      serviceSelect.add(allServicesOption);

      if (typeof data === 'object' && !Array.isArray(data)) {
        Object.entries(data).forEach(([key, value]) => {
          const option = new Option(value, key);
          serviceSelect.add(option);
        });
      } else {
        console.error('Services data is not in the expected format:', data);
      }
      
      if ($ && $.fn.dropdown) {
        $(serviceSelect).dropdown('refresh');
      }
    })
    .catch(error => console.error('Error loading services:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  populateDropdowns();
  displayCompanies();
  
  document.getElementById('submit-form').addEventListener('click', submitCompanyData);

  // Initialize Semantic UI dropdowns
  $('.ui.dropdown').dropdown({
    clearable: true,
    placeholder: 'Select...'
  });

  // Initialize tabs
  $('.menu .item').tab();

  // Add click event listeners to tab menu items
  $('.menu .item').on('click', function() {
    // Remove 'active' class from all items
    $('.menu .item').removeClass('active');
    // Add 'active' class to clicked item
    $(this).addClass('active');
    
    // Get the tab to show
    const tabToShow = $(this).data('tab');
    
    // Hide all tab content
    $('.ui.tab').removeClass('active');
    // Show the selected tab content
    $(`.ui.tab[data-tab="${tabToShow}"]`).addClass('active');
  });

});