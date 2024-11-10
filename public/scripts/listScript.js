// Written by: Hazel Miln
// Purpose: This script loads json data of NCR reports, and displays the data in a table to the user

async function getData(){
    
        const response = await fetch('http://localhost:5500/records');
        const data = await response.json();

        const table = document.getElementById("table");

        for (let key in data)
        {
            let record = key[key]
            console.log(record);
        }
    

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
};

getData();
