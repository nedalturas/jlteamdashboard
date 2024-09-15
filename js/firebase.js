// Initialize Firebase
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

// Get a reference to the database service
const database = firebase.database();

// Function to submit company data
function submitCompanyData() {
  const companyName = document.getElementById('company-name').value;
  const cityCoverage = $('#city-coverage').val(); // Using jQuery to get multiple values
  const services = $('#services').val(); // Using jQuery to get multiple values
  const companyType = document.getElementById('company-type').value;
  const whatsappLink = document.getElementById('whatsapp-link').value;
  const adminNotes = document.getElementById('admin-notes').value;

  // Create a new company entry in the database
  const newCompanyRef = database.ref('companies').push();

  newCompanyRef.set({
    name: companyName,
    cityCoverage: cityCoverage,
    services: services,
    type: companyType,
    whatsappLink: whatsappLink,
    adminNotes: adminNotes,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  })
  .then(() => {
    // console.log('Company data submitted successfully');
    $.toast({
      title: 'Success!',
      message: 'Company added to the database!',
      showProgress: 'bottom',
      classProgress: 'green'
    })
    ;
    
    // Clear all form fields
    document.getElementById('company-name').value = '';
    document.getElementById('company-type').value = '';
    document.getElementById('whatsapp-link').value = '';
    document.getElementById('admin-notes').value = '';
    
    // Reset dropdown selections
    $('#city-coverage').dropdown('clear');
    $('#services').dropdown('clear');
    
    // Show a success message
  })
  .catch((error) => {
    console.error('Error submitting company data:', error);
    // Show an error message to the user
    alert('Error submitting company data. Please try again.');
  });
}
// Function to fetch and populate dropdown options from JSON files
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
      if (Array.isArray(data)) {
        data.forEach(service => {
          const option = new Option(service.name, service.id);
          serviceSelect.add(option);
        });
      } else if (typeof data === 'object') {
        // If data is an object, iterate over its properties
        Object.entries(data).forEach(([key, value]) => {
          const option = new Option(value, key);
          serviceSelect.add(option);
        });
      } else {
        console.error('Services data is not an array or object:', data);
      }
      if ($ && $.fn.dropdown) {
        $(serviceSelect).dropdown('refresh');
      }
    })
    .catch(error => console.error('Error loading services:', error));
}

// Function to fetch and display companies in the admin table
function displayCompanies() {
  const tableBody = document.querySelector('.ui.table tbody');
  database.ref('companies').on('value', (snapshot) => {
    tableBody.innerHTML = ''; // Clear existing rows
    snapshot.forEach((childSnapshot) => {
      const company = childSnapshot.val();
      const row = `
        <tr>
          <td>${company.name}</td>
          <td>${company.cityCoverage.join(', ')}</td>
          <td>${company.services.join(', ')}</td>
          <td>
            <button class="ui mini blue icon button" onclick="viewCompany('${childSnapshot.key}')"><i class="eye icon"></i></button>
            <button class="ui mini red icon button" onclick="editCompany('${childSnapshot.key}')"><i class="pencil icon"></i></button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  });
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  populateDropdowns();
  displayCompanies();
  
  document.getElementById('submit-form').addEventListener('click', submitCompanyData);

  // Initialize Semantic UI dropdowns
  $('.ui.dropdown').dropdown();
});