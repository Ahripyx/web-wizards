// Written by: Hazel Miln
// Purpose: Gets and displays all NCR info in a readable format

async function getData(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const ncrId = parseInt(urlParams.get('id'));
    const response = await fetch(`http://localhost:5500/AllInfo?id=${ncrId}`);
    const data = await response.json();
    //console.log(data);
    
    const table = document.getElementById("displayTable");

    data.forEach(element =>{
        for (let item in element){
            console.log(item.substr(-2).toUpperCase());
            if (item.substr(-2).toUpperCase() == "ID"){
                
            }
            else{
                
                table.innerHTML += `<tr><td>${item}:</td><td>${element[item]}</td></tr>`;
            }  
        }
    });
    
    
    
};
console.log('hi');
getData();