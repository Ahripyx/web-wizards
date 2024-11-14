// Written By: Damion Murcell
// Purpose: This script is for any navigations in the pages

// ====== Navigation For Nav Bar ====== 
document.getElementById("btnNavHome").addEventListener('click', function(){
    window.location.href = "index.html"
})
document.getElementById("btnNavCreateNCR").addEventListener('click', function(){
    window.location.href = "create.html"
})

document.getElementById("btnNavNCRs").addEventListener('click', function(){
    window.location.href = "list.html"
})

// ====== Navigation For Home Page Buttons ====== 
document.getElementById("btnCreateNCR").addEventListener('click', function(){
    window.location.href = 'create.html'
})
document.getElementById("btnViewNCR").addEventListener('click', function(){
    window.location.href = 'list.html';
});
document.getElementById("btnViewRep").addEventListener('click', function(){
    window.location.href = "reports.html"
})