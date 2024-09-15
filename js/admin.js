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

// Event listener to initialize admin functionalities
document.addEventListener('DOMContentLoaded', () => {
  displayCompanies();
});
