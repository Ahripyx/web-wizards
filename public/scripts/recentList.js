// Written by: Hazel Miln
// Edited by: Damion Murcell
// Purpose: This script loads JSON data of NCR reports, and displays only the recent relevant data in a table to the user

async function getData() {
    // Get the JSON data
    const data = await fetch('../public/data/forms.json');
    const json = await data.json();

    // Retrieve the table element
    const table = document.getElementById("table");

    // Array to hold the form entries
    let entries = [];

    // Loop through the JSON file
    for (let key in json.forms) {
        let entry = json.forms[key];

        // Store each entry's relevant fields in the entries array
        entries.push({
            id: entry.id,
            ncrNum: entry.ncrNum,
            itemDescription: entry.itemDescription,
            date: new Date(entry.date),  // Store date as a Date object for sorting
            status: entry.status
        });
    }

    // Sort entries by date (most recent first)
    entries.sort((a, b) => b.date - a.date);

    // Loop through sorted data and populate the table
    entries.forEach(entry => {
        // Create a new row for each entry
        const tablerow = document.createElement('tr');
        
        // Add cells for NCR Number, Item Name, Date, and Status
        tablerow.innerHTML = `
            <td>${entry.ncrNum}</td>
            <td>${entry.itemDescription}</td>
            <td>${entry.date.toLocaleDateString()}</td>  <!-- Format date nicely -->
            <td>${entry.status}</td>
        `;

        // Add the "Edit" link in the last column
        tablerow.innerHTML += `<td><a href="edit.html?id=${entry.id}">Edit</a></td>`;
        
        // Append the new row to the table
        table.appendChild(tablerow);
    });
}

// Call the function to load and display the data
getData();
