const fetchBySelect = document.getElementById('fetch-by');
const fetchInput = document.querySelector('.input-group input[type="text"]');
const fetchBtn = document.getElementById('fetch-btn');
const tableBody = document.querySelector('tbody');
const statusDateInput = document.getElementById("status-date");
const updateBtn = document.getElementById("update-btn");
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
const filterBtn = document.getElementById("filter-btn");
const statusSelect = document.getElementById("status");

let jsonData = [];

// Fetch Data from JSON File
async function fetchData() {
  try {
    const res = await fetch('data.json'); 
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    jsonData = await res.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    alert('Failed to fetch data. Please try again later.');
  }
}

// Populate Table
function populateTable(data) {
  tableBody.innerHTML = '';

  data.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row["Booking Date"]}</td>
      <td>${row["Dispatching Date"]}</td>
      <td>${row["Sr. No."]}</td>
      <td>${row["Order ID"]}</td>
      <td>${row["Customer Name"]}</td>
      <td>${row["Contact"]}</td>
      <td>${row["District"]}</td>
      <td>${row["Product Name"]}</td>
      <td>${row["Product Price"]}</td>
      <td>${row["VPL Price"]}</td>
      <td>${row["Agent Name"]}</td>
      <td>${row["Status"]}</td>
      <td>${row["Status Date"] || 'N/A'}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Filter Data by Booking Date Range and Status
async function filterByBookingDateRangeAndStatus() {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  const status = statusSelect.value;

  if (!startDate || !endDate || startDate > endDate) {
    alert("Please select a valid booking date range.");
    return;
  }

  const data = jsonData.length ? jsonData : await fetchData();
  if (data) {
    const filteredData = data.filter((item) => {
      const bookingDate = new Date(item["Booking Date"]);
      const isInDateRange = bookingDate >= startDate && bookingDate <= endDate;
      const isMatchingStatus = status === "" || item["Status"].toLowerCase() === status.toLowerCase();
      
      return isInDateRange && isMatchingStatus;
    });

    if (filteredData.length > 0) {
      populateTable(filteredData);
    } else {
      alert("No data found for the given criteria.");
      tableBody.innerHTML = '';
    }
  }
}

// Filter Data by Criteria
async function filterData() {
  const criteria = fetchBySelect.value;
  const value = fetchInput.value.trim(); 

  if (!value) {
    alert('Please enter a valid value.');
    return;
  }

  const criteriaKey = criteria === 'sr-no' ? 'Sr. No.' : 'Order ID';
  const data = jsonData.length ? jsonData : await fetchData();

  if (data) {
    const filteredData = data.filter((item) =>
      String(item[criteriaKey]).toLowerCase() === value.toLowerCase()
    );

    if (filteredData.length > 0) {
      populateTable(filteredData);
    } else {
      alert('No data found for the given criteria.');
      tableBody.innerHTML = ''; 
    }
  }
}

// Update Status Date
async function updateStatusDate() {
  const criteria = fetchBySelect.value; 
  const value = fetchInput.value.trim();

  if (!value) {
    alert("Please enter a valid value.");
    return;
  }

  const criteriaKey = criteria === "sr-no" ? "Sr. No." : "Order ID"; 
  const data = await fetchData();

  if (data) {
    const updatedRow = data.find(
      (item) => String(item[criteriaKey]).toLowerCase() === value.toLowerCase()
    );

    if (updatedRow) {
      const newStatusDate = statusDateInput.value;
      if (!newStatusDate) {
        alert("Please select a status date.");
        return;
      }

      updatedRow["Status Date"] = newStatusDate;
      tableBody.innerHTML = ""; 
      populateTable([updatedRow]);
      alert("Status date updated successfully.");
    } else {
      alert("No data found for the given criteria.");
    }
  }
}

fetchBtn.addEventListener('click', filterData);
updateBtn.addEventListener('click', updateStatusDate);
filterBtn.addEventListener('click', filterByBookingDateRangeAndStatus);


