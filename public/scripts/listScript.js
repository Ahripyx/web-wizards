// Written by: Hazel Miln
// Purpose: 

async function filltables(data, table){
    table.innerHTML = `
    <tr class="shaded-cells">
        <th>NCR</th>
        <th>Supplier</th>                
        <th>Status</th>
        <th>Date</th>
        <th></th>
        <th></th>
    </tr>`;
    var tabindex = 50;
    var row = 0;

    data.forEach(element => {
        console.log(element.id);
        if (row % 2 == 1){
            table.innerHTML += `<tr id="${element.id}" class="light-cells"></tr>`
        }
        else{
            table.innerHTML += `<tr id="${element.id}"></tr>`
        }
        var tablerow = document.getElementById(element.id);
        tablerow.innerHTML =
            `
            <td class="table-borders">${element.NCRNumber}</td>
            <td class="table-borders">${element.SupplierName}</td>
            <td class="table-borders">${element.FormStatus}</td>
            <td class="table-borders">${element.CreationDate}</td>
            <td class="table-borders"><a href="details.html?id=${element.id}" tabindex=${tabindex+5}>Details</a></td>
            <td class="table-borders"><a href="edit.html?id=${element.id}" tabindex=${tabindex+10}>Edit</a></td>
            `
        tabindex+=20;
        row++;
    });
};      

async function getData(){

    const response = await fetch(`http://localhost:5500/FilterSummaryInfo?supplierFilter=&status=Open&date1=0001-01-01&date2=9999-12-12`);
    const data = await response.json();
    const table = document.getElementById("table");

    filltables(data, table);
};

getData();

document.getElementById("btnFilter").addEventListener("click", async function(){
        
    const supplier = document.getElementById("filterSupplier").value;

    const ddl = document.getElementById("filterStatus");
    const status = ddl.options[ddl.selectedIndex].value;
    console.log(status)

    var date1 = document.getElementById("dateBox1").value;
    var date2 = document.getElementById("dateBox2").value;

    if (date1 == ''){
        date1 = '0001-01-01';
        
    }
    if(date2 == ''){
        date2 = '9999-12-12';
    }

    const response = await fetch(`http://localhost:5500/FilterSummaryInfo?supplierFilter=${supplier}&status=${status}&date1=${date1}&date2=${date2}`);
    const data = await response.json();
    const table = document.getElementById("table");

    filltables(data, table);
});

document.getElementById("")
