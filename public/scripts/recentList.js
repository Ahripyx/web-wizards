// Purpose: This script loads the most recent NCR records from the server and displays them in a table.

async function getData() {
    // Fetch the most recent 5 NCR records from the server
    const response = await fetch('http://localhost:5500/recent-ncrs');
    const data = await response.json();
    const table = document.getElementById("table");

    // Increment row
    var row = 0;

    // Loop through each NCR record and populate the table
    data.forEach(element => {
        // Create a new row for each NCR record
        if (row % 2 == 1){
            table.innerHTML += `<tr id="ncr-${element.id}" class="light-cells"></tr>`
        }
        else{
            table.innerHTML += `<tr id="ncr-${element.id}"></tr>`
        }
        //table.innerHTML += `<tr id="ncr-${element.id}"></tr>`;
        const tablerow = document.getElementById(`ncr-${element.id}`);

        // Populate the row with NCR details
        tablerow.innerHTML = `
            <td class="table-borders">${element.NCRNumber}</td>
            <td class="table-borders">${element.SupplierName}</td>
            <td class="table-borders">${element.FormStatus}</td>
            <td class="table-borders">${new Date(element.LastModified).toLocaleDateString()}</td>
            <td class="table-borders"><a href="details.html?id=${element.id}">Details</a></td>
            <td class="table-borders"><a href="details.html?id=${element.id}">Edit</a></td>
        `;
        row++;
    });
}

// Function to handle archiving an NCR (stub, can be updated)
function archiveNCR(id) {
    console.log("Archiving NCR:", id);
    // Perform archive operation (e.g., update status in the database)
}

// Call the function to load and display the data
getData();
