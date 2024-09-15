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
  const cityCoverage = $('#city-coverage').dropdown('get value');
  const services = $('#services').dropdown('get value');
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
    console.log('Company data submitted successfully');
    clearForm();
    alert('Company data submitted successfully');
  })
  .catch((error) => {
    console.error('Error submitting company data:', error);
    alert('Error submitting company data. Please try again.');
  });
}

function clearForm() {
  document.getElementById('company-name').value = '';
  $('#city-coverage').dropdown('clear');
  $('#services').dropdown('clear');
  document.getElementById('company-type').value = '';
  document.getElementById('whatsapp-link').value = '';
  document.getElementById('admin-notes').value = '';
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
          <td>${company.cityCoverage}</td>
          <td>${formatServices(company.services)}</td>
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

function formatServices(services) {
  if (!services) return '';
  if (typeof services === 'string') {
    return services.split(',').map(s => s.trim()).join(', ');
  }
  if (Array.isArray(services)) {
    return services.join(', ');
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  displayCompanies();
  
  const submitButton = document.getElementById('submit-form');
  if (submitButton) {
    submitButton.addEventListener('click', submitCompanyData);
  } else {
    console.error('Submit button not found');
  }
});
