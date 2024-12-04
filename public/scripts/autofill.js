//Written by: Damion Murcell
//Purpose: JS file is temporary and for testing and showcasing reasons only

//============= Login.html =============
function populateLogin(email, password){
    document.getElementById("email").value = email;
    document.getElementById("password").value = password
}
document.getElementById('btnQA').addEventListener('click', function(){
    populateLogin("quality@crossfire.ca", "quality")
});
document.getElementById('btnEng').addEventListener('click', function(){
    populateLogin("engineer@crossfire.ca", "engineer")
});
document.getElementById('btnPur').addEventListener('click', function(){
    populateLogin("purchasing@crossfire.ca", "purchasing")
});
document.getElementById('btnAdmin').addEventListener('click', function(){
    populateLogin("admin@crossfire.ca", "admin")
});