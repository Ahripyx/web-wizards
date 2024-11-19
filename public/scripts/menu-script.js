menuModal = document.getElementById('menu-list');

// When the user clicks on the button, open the modal
document.getElementById("menu-icon").onclick = function() {
    menuModal.style.display = "flex";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == menuModal) {
    menuModal.style.display = "none";
  }
}