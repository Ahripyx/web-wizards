// Written by: Hazel Miln
// Purpose: This script loads json data of NCR reports, and displays the data in a table to the user

async function getData(){

    const response = await fetch('http://localhost:5500/SummaryInfo');
    const data = await response.json();
    const table = document.getElementById("table");

    var tabindex = 50;

    data.forEach(element => {
        console.log(element.id);
        table.innerHTML += `<tr id="${element.id}"></tr>`
        var tablerow = document.getElementById(element.id);
        tablerow.innerHTML =
            `
            <td class="table-borders">${element.NCRNumber}</td>
            <td class="table-borders">${element.SupplierName}</td>
            <td class="table-borders">${element.FormStatus}</td>
            <td class="table-borders">${element.CreationDate}</td>
            <td class="table-borders"><a href="details.html?id=${element.id}" tabindex=${tabindex}>View</a></td>
            `
        tabindex+=5;
    });
};

getData();

document.getElementById("btnFilter").addEventListener("click", async function(){
        
    const supplier = document.getElementById("filterSupplier").value;

    const ddl = document.getElementById("filterStatus");
    const status = ddl.options[ddl.selectedIndex].value;
    console.log(status)

    var date1 = document.getElementById("dateBox1").value;
    var date2 = document.getElementById("dateBox2").value;

    if (date1 == '' || date2 == ''){
        date1 = '0001-01-01';
        date2 = '9999-12-12';
    }



    const response = await fetch(`http://localhost:5500/FilterSummaryInfo?supplierFilter=${supplier}&status=${status}&date1=${date1}&date2=${date2}`);
    const data = await response.json();

    const table = document.getElementById("table");
    table.innerHTML = "";
    
    data.forEach(element => {
        console.log(element.id);
        table.innerHTML += `<tr id="${element.id}"></tr>`
        var tablerow = document.getElementById(element.id);
        tablerow.innerHTML =
            `
            <td class="table-borders">${element.NCRNumber}</td>
            <td class="table-borders">${element.SupplierName}</td>
            <td class="table-borders">${element.FormStatus}</td>
            <td class="table-borders">${element.LastModified}</td>
            <td class="table-borders"><a href="details.html?id=${element.id}">View</a></td>
            `
    })
});
    

    /*
    // get the json data
    const data = await fetch('../public/data/forms.json');
    const json = await data.json();

    // retrieve table
    const table = document.getElementById("table");

    // stores the current row
    row = 0;

    // loops through json file
    for (let key in json){
        for (let subKey in json[key]) {

            // keep track of which row loop is on, and add a row to the table
            row++; 
            table.innerHTML += `<tr id="${row}"></tr>`;
            var id;

            // loops through json file
            for (let subsubKey in json[key][subKey]){

                // store each value part of value-key pair
                var field = JSON.stringify(json[key][subKey][subsubKey]);
                // console.log(subsubKey+ ": "+field);

                // get the current row using the tracking variable
                var tablerow = document.getElementById(row);

                if (subsubKey == "id"){
                    id = field;
                    console.log(id);
                }
                // add a rowdefinition to the current row containing the matching data to the table headings
                if (subsubKey == "ncrNum"|| subsubKey=="itemDescription" || subsubKey == "quantityReceived" || subsubKey == "quantityDefective" || subsubKey == "defectDescription"
                || subsubKey == "status" || subsubKey == "date" || subsubKey == "user"){
                    tablerow.innerHTML += `<td>${field}</td>`
                }
                
            }
            // create a button that passes the item id as a parameter
            tablerow.innerHTML += `<td><a href="edit.html?id=${id}">Edit</a></td>`;
        }   
    }   
*/    

