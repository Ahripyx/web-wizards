// Function to increment the notification count
function newNotification(form, type) {
    try
    {
        let count = parseInt(localStorage.getItem('notificationCount') || '0', 10);
        count += 1;
        localStorage.setItem('notificationCount', count);

        const parsedForm = JSON.parse(form);

        localStorage.setItem(`form-${parsedForm.id}`, form);
        updateNotification(type);
    }
    catch (error)
    {
        console.error('Failed to add notification:', error);
        alert("Failed to add notification." + error);
    }
   
}

// Function to update the notification modal
function updateNotification(type = null) {
    const notificationCount = document.getElementById('notification-count');
    const notificationModal = document.getElementById('notification-content');

    // Set the notif count to the current count
    if (notificationCount) {
        notificationCount.textContent = parseInt(localStorage.getItem('notificationCount') || '0', 10);
    }

    // Set the notif modal to display the forms
    if (notificationModal) {
        notificationModal.innerHTML = '<span class="close">&times;</span><p>Newly created forms...</p>';
        for (var i = 0; i < localStorage.length; i++){
            if (localStorage.key(i).startsWith('form-'))
            {
                // IT WORKS!!! IOT WORKS!!!!!!!!
                const value = localStorage.getItem(localStorage.key(i));
                const parsedForm = JSON.parse(value);
                notificationModal.innerHTML += `<a href="details.html?id=${parsedForm.id}" onclick="deleteNotification(${parsedForm.id})"> New form for Review - ${parsedForm.LastModified} </a><br/>`;
            }
        };
    }
}

function deleteNotification(id) {
    localStorage.removeItem(`form-${id}`);
    let count = parseInt(localStorage.getItem('notificationCount') || '0', 10);
    count -= 1;
    localStorage.setItem('notificationCount', count);
}

// Initialize the notif display when page load
document.addEventListener('DOMContentLoaded', () => {
    updateNotification();
});

// Get the modal
var modal = document.getElementById("notification-modal");

// Get the button that opens the modal
var btn = document.getElementById("btnNotification");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}