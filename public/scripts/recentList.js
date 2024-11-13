// Written by: Hazel Miln
// Edited by: Damion Murcell
// Purpose: This script loads NCR data from the server, displays the most recent 5 records, and allows filtering

async function getData() {
    // Fetch the most recent 5 NCR records from the server
    const response = await fetch('/recent-ncrs');
    const data = await response.json();

    // Retrieve the table element
    const table = document.getElementById("table");

    // Array to hold the form entries
    let entries = [];

    // Loop through the data and store the entries
    data.forEach(entry => {
        entries.push({
            id: entry.id,
            ncrNum: entry.NCRNumber,
            itemDescription: entry.SupplierName,  // Assuming SupplierName as item description
            date: new Date(entry.LastModified),  // Store date as a Date object for sorting
            status: entry.FormStatus
        });
    });

    // Function to update the table with the entries
    function updateTable(entries) {
        // Clear existing rows in the table (except the header)
        table.innerHTML = `
            <tr>
                <th>NCR Number</th>
                <th>Item Name</th>     
                <th>Date</th>           
                <th>Status</th>
                <th>Actions</th>
            </tr>`;

        // Loop through the entries and populate the table
        entries.forEach(entry => {
            const tablerow = document.createElement('tr');
            tablerow.innerHTML = `
                <td>${entry.ncrNum}</td>
                <td>${entry.itemDescription}</td>
                <td>${entry.date.toLocaleDateString()}</td>
                <td>${entry.status}</td>
                <td><a href="edit.html?id=${entry.id}">Edit</a></td>
            `;
            table.appendChild(tablerow);
        });
    }

    // Call the function to display the initial table with the fetched entries
    updateTable(entries);

    // Add filter functionality
    document.getElementById("btnFilter").addEventListener('click', function () {
        const ncrNum = document.getElementById("numFilter").value.toLowerCase();
        const item = document.getElementById("itemFilter").value.toLowerCase();
        const date = document.getElementById("dateFilter").value;  // format: YYYY-MM-DDTHH:mm
        const status = document.getElementById("statusFilter").checked;

        // Filter the entries based on the filter values
        let filteredEntries = entries.filter(entry => {
            let matches = true;

            // Filter by NCR Number
            if (ncrNum && !entry.ncrNum.toLowerCase().includes(ncrNum)) {
                matches = false;
            }

            // Filter by Item Description
            if (item && !entry.itemDescription.toLowerCase().includes(item)) {
                matches = false;
            }

            // Filter by Date
            if (date) {
                const filterDate = new Date(date);
                if (entry.date.toDateString() !== filterDate.toDateString()) {
                    matches = false;
                }
            }

            // Filter by Status
            if (status && entry.status !== "complete") {
                matches = false;
            }

            return matches;
        });

        // Update the table with the filtered entries
        updateTable(filteredEntries);
    });
}

// Call the function to load and display the data
getData();
