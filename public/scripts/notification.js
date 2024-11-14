// Function to increment the notification count
function newNotification(form) {
    try
    {       
        let count = parseInt(localStorage.getItem('notificationCount') || '0', 10);
        count += 1;
        localStorage.setItem('notificationCount', count);

        const parsedForm = JSON.parse(form);
        
        localStorage.setItem(`form-${parsedForm.id}`, form);
        updateNotification();
    }
    catch (error)
    {
        console.error('Failed to add notification:', error);
        alert("Failed to add notification." + error);
    }
   
}

// Function to update the notification modal
function updateNotification() {
    const notificationCount = document.getElementById('notification-count');

    const notificationModal = document.getElementById('notification-modal');

    notificationModal.innerHTML =`
    <div class="modal-content" id="notification-content">
                  <span class="close" onclick="notificationModal.style.display = 'none';">&times;</span>
                  <div class="notification-container">
                     <h3>New Quality Forms</h3>
                     <ul id="quality-list">
                     </ul>
               </div>
<div class="notification-container">
                     <h3>New Engineer Forms</h3>
                     <ul id="engineer-list">
                     </ul>
               </div>
               </div>
    
    `;

    const notificationContent = document.getElementById('notification-content');

    // Set the notif count to the current count
    if (notificationCount) {
        notificationCount.textContent = parseInt(localStorage.getItem('notificationCount') || '0', 10);
    }

    // Set the notif modal to display the forms
    if (notificationContent) {
        //notificationModal.innerHTML = '<span class="close">&times;</span><p>New forms to review.</p>';
        const qualitylist = document.getElementById('quality-list');
        const engineerlist = document.getElementById('engineer-list');
        for (var i = 0; i < localStorage.length; i++){
            if (localStorage.key(i).startsWith('form-'))
            {
                // IT WORKS!!! IOT WORKS!!!!!!!!
                const value = localStorage.getItem(localStorage.key(i));
                const parsedForm = JSON.parse(value);
                const notifText = `<li><a href="details.html?id=${parsedForm.id}" onclick="deleteNotification(${parsedForm.id})"> ${parsedForm.NCRNumber} - ${parsedForm.LastModified} </a></li>`;
                if (parsedForm.type == "Quality" && qualitylist)
                {
                    qualitylist.innerHTML += notifText;
                }
                else if (parsedForm.type == "Engineering")
                {
                    engineerlist.innerHTML += notifText;
                }
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

notificationModal = document.getElementById('notification-modal');

// When the user clicks on the button, open the modal
document.getElementById("btnNotification").onclick = function() {
    notificationModal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == notificationModal) {
    notificationModal.style.display = "none";
  }
}