// Written By: Damion Murcell
// Purpose: This script is for any navigations in the pages

// Navigation For Nav Bar (In The Future)


// Navigation For Home Page Buttons
document.getElementById("btnCreateNCR").addEventListener('click', function(){
    window.location.href = 'form.html'
})
document.getElementById("btnViewNCR").addEventListener('click', function(){
    window.location.href = 'list.html';
});
document.getElementById("btnViewReports").addEventListener('click', function(){
    console.log("Remove the // when reports exist")
    //window.location.href = "reports.html"
})