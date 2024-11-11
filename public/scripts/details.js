// Written by: Hazel Miln
// Purpose: Gets and displays all NCR info in a readable format

async function getData(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const ncrId = parseInt(urlParams.get('id'));
    const response = await fetch(`http://localhost:5500/AllInfo`);
    const data = await response.json();
    console.log(data);
    
    document.getElementById("displayTable");
    
    
    
};
console.log('hi');
getData();