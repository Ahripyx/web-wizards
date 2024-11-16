
// Function to increment the notification count
function newNotification(form) {
    try
    {
        let admin_count = parseInt(localStorage.getItem('admin_count') || '0', 10);
        let quality_count = parseInt(localStorage.getItem('quality_count') || '0', 10);
        let engineer_count = parseInt(localStorage.getItem('engineer_count') || '0', 10);
        let purchasing_count = parseInt(localStorage.getItem('purchasing_count') || '0', 10);

        const parsedForm = JSON.parse(form);
        
    if (parsedForm.type == "Quality") increment('quality_count', quality_count, admin_count);
    else if (parsedForm.type == "Engineering") increment('engineer_count', engineer_count, admin_count);
    else if (parsedForm.type == "Purchasing") increment('purchasing_count', purchasing_count, admin_count);

        localStorage.setItem(`form-${parsedForm.lastInsertRowid}-${parsedForm.type}`, form);
        updateNotification();
    }
    catch (error)
    {
        console.error('Failed to add notification:', error);
        alert("Failed to add notification." + error);
    }
   
}

function increment(type, count, admin) {
    count += 1;
    admin += 1;
    localStorage.setItem(type, count);
    localStorage.setItem('admin_count', admin);
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
    const user = JSON.parse(localStorage.getItem('user'));
    // Set the notif count to the current count
    if (notificationCount)
    {
        if (user.RoleID == 1) notificationCount.textContent = parseInt(localStorage.getItem('admin_count') || '0', 10);
            else if (user.RoleID == 2) notificationCount.textContent = parseInt(localStorage.getItem('quality_count') || '0', 10);
            else if (user.RoleID == 3) notificationCount.textContent = parseInt(localStorage.getItem('engineer_count') || '0', 10);
            else if (user.RoleID == 4) notificationCount.textContent = parseInt(localStorage.getItem('purchasing_count') || '0', 10);
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
                    const notifText = `<li><a href="details.html?id=${parsedForm.lastInsertRowid}" onclick="deleteNotification(${parsedForm.lastInsertRowid}, '${parsedForm.type}')"> ${parsedForm.NCRNumber} </a></li>`;
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

function deleteNotification(id, type) {
    try
    {
        localStorage.removeItem(`form-${id}-${type}`);

        if (type == "Quality") decrement('quality_count', 'admin_count');
        else if (type == "Engineering") decrement('engineer_count', 'admin_count');
        else if (type == "Purchasing") decrement('purchasing_count', 'admin_count');
    } catch (error)
    {
        console.error('Failed to delete notification:', error);
        alert("Failed to delete notification.");
    }
}

function decrement(type, adminType) {
    let count = parseInt(localStorage.getItem(type) || '0', 10);
    let adminCount = parseInt(localStorage.getItem(adminType) || '0', 10);

        count -= 1;
        localStorage.setItem(type, count);
        adminCount -= 1;
        localStorage.setItem(adminType, adminCount);
}

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