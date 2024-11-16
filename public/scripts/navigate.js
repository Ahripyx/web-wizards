// Written By: Damion Murcell
// Purpose: This script is for any navigations in the pages

// ====== Navigation For Nav Bar ====== 
const ancHome = document.getElementById("ancHome");
if (ancHome) {
    ancHome.addEventListener('click', function() {
        window.location.href = "index.html";
    });
}

const ancCreate = document.getElementById("ancCreate");
if (ancCreate) {
    ancCreate.addEventListener('click', function() {
        window.location.href = "create.html";
    });
}

const ancLogs = document.getElementById("ancLogs");
if (ancLogs) {
    ancLogs.addEventListener('click', function() {
        window.location.href = "list.html";
    });
}

const ancTools = document.getElementById("ancTools");
if (ancTools){
    ancTools.addEventListener('click', function(){
        window.location.href = "tools.html"
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