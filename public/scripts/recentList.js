// Written by: Hazel Miln
// Edited by: Damion Murcell
// Purpose: This script loads json data of NCR reports, and displays the data in a table to the user, also including filtering

async function getData() {
    // Get the JSON data
    const data = await fetch('../public/data/forms.json');
    const json = await data.json();

    // Retrieve the table element
    const table = document.getElementById("table");

    // Array to hold the form entries
    let entries = [];

    // Loop through the JSON file and store the entries
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

    // Store the original entries for filtering later
    const originalEntries = [...entries];

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

        // Loop through filtered data and populate the table
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

    // Call the function to initially display all entries
    updateTable(entries);

    // Add the filter functionality
    document.getElementById("btnFilter").addEventListener('click', function () {
        const ncrNum = document.getElementById("numFilter").value.toLowerCase();
        const item = document.getElementById("itemFilter").value.toLowerCase();
        const date = document.getElementById("dateFilter").value; // format: YYYY-MM-DDTHH:mm
        const status = document.getElementById("statusFilter").checked;

        // Filter the entries based on the filter values
        let filteredEntries = originalEntries.filter(entry => {
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






// !!!!!!!!!!!!!!!!!!!!!!!!!! DELETE THIS LATER WHEN CODE IS CLEANED UP AND WORKING !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// async function getData() {
//     // Get the JSON data
//     const data = await fetch('../public/data/forms.json');
//     const json = await data.json();

//     // Retrieve the table element
//     const table = document.getElementById("table");

//     // Array to hold the form entries
//     let entries = [];

//     // Loop through the JSON file
//     for (let key in json.forms) {
//         let entry = json.forms[key];

//         // Store each entry's relevant fields in the entries array
//         entries.push({
//             id: entry.id,
//             ncrNum: entry.ncrNum,
//             itemDescription: entry.itemDescription,
//             date: new Date(entry.date),  // Store date as a Date object for sorting
//             status: entry.status
//         });
//     }

//     // Sort entries by date (most recent first)
//     entries.sort((a, b) => b.date - a.date);

//     // Loop through sorted data and populate the table
//     entries.forEach(entry => {
//         // Create a new row for each entry
//         const tablerow = document.createElement('tr');
        
//         // Add cells for NCR Number, Item Name, Date, and Status
//         tablerow.innerHTML = `
//             <td>${entry.ncrNum}</td>
//             <td>${entry.itemDescription}</td>
//             <td>${entry.date.toLocaleDateString()}</td>  <!-- Format date nicely -->
//             <td>${entry.status}</td>
//         `;

//         // Add the "Edit" link in the last column
//         tablerow.innerHTML += `<td><a href="edit.html?id=${entry.id}">Edit</a></td>`;
        
//         // Append the new row to the table
//         table.appendChild(tablerow);
//     });
// }

// // Call the function to load and display the data
// getData();

// document.getElementById("btnFilter").addEventListener('click', function(){
//     const ncrNum = document.getElementById("numFilter")
//     const item = document.getElementById("itemFilter")
//     const date = document.getElementById("dateFilter")
//     const status = document.getElementById("statusFilter")


// })
