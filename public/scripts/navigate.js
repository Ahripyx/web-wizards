// Written By: Damion Murcell
// Purpose: This script is for any navigations in the pages

// ====== Navigation For Nav Bar ====== 
const btnNavHome = document.getElementById("btnNavHome");
if (btnNavHome) {
    btnNavHome.addEventListener('click', function() {
        window.location.href = "index.html";
    });
}

const btnNavCreateNCR = document.getElementById("btnNavCreateNCR");
if (btnNavCreateNCR) {
    btnNavCreateNCR.addEventListener('click', function() {
        window.location.href = "create.html";
    });
}

const btnNavNCRs = document.getElementById("btnNavNCRs");
if (btnNavNCRs) {
    btnNavNCRs.addEventListener('click', function() {
        window.location.href = "list.html";
    });
}

// ====== Navigation For Home Page Buttons ====== 
const btnCreateNCR = document.getElementById("btnCreateNCR");
if (btnCreateNCR) {
    btnCreateNCR.addEventListener('click', function() {
        window.location.href = 'create.html';
    });
}

const btnViewNCR = document.getElementById("btnViewNCR");
if (btnViewNCR) {
    btnViewNCR.addEventListener('click', function() {
        window.location.href = 'list.html';
    });
}

const btnViewRep = document.getElementById("btnViewRep");
if (btnViewRep) {
    btnViewRep.addEventListener('click', function() {
        window.location.href = "reports.html";
    });
}