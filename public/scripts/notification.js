let notificationModal;
document.addEventListener("DOMContentLoaded", function() {
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

    notificationModal.addEventListener("click", function(event) {
        if (event.target.matches("#close-modal")) {
            notificationModal.style.display = "none";
        }
    });

    updateNotification();
});

// Function to increment the notification count
export function newNotification(form) {
    try {
        console.log(form);
        let admin_count = parseInt(localStorage.getItem('admin_count') || '0', 10);
        let quality_count = parseInt(localStorage.getItem('quality_count') || '0', 10);
        let engineer_count = parseInt(localStorage.getItem('engineer_count') || '0', 10);
        let purchasing_count = parseInt(localStorage.getItem('purchasing_count') || '0', 10);

        const pf = JSON.parse(form);
    
            let duplicate = false;
                if (localStorage.getItem(`form-${pf.NCRFormID}-${pf.type}`)) 
                    duplicate = true;

            if (pf.Status == "Open" && !duplicate)
            {
                if (pf.type == "Quality")
                    increment('quality_count', quality_count, admin_count);
                else if (pf.type == "Engineer")
                    increment('engineer_count', engineer_count, admin_count);
            }
            else if (pf.Status == "Closed" && duplicate)
            {
                if (pf.type == "Quality")
                {
                    decrement('quality_count', 'admin_count');
                    increment('engineer_count', engineer_count, admin_count);
                }
                else if (pf.type == "Engineer")
                {
                    decrement('engineer_count', 'admin_count');
                    //increment('quality_count', quality_count, admin_count);
                }
            }

        localStorage.setItem(`form-${pf.NCRFormID}-${pf.type}`, form);
        updateNotification();
    } catch (error) {
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
    const user = JSON.parse(localStorage.getItem('user'));

    const notificationCount = document.getElementById('notification-count');
    const notificationModal = document.getElementById('notification-modal');

    setupUserView(user.RoleID);

    const notificationContent = document.getElementById('notification-content');

    // Set the notif count to the current count
    if (notificationCount) {
        if (user.RoleID == 1) notificationCount.textContent = parseInt(localStorage.getItem('admin_count') || '0', 10);
        else if (user.RoleID == 2) notificationCount.textContent = parseInt(localStorage.getItem('quality_count') || '0', 10);
        else if (user.RoleID == 3) notificationCount.textContent = parseInt(localStorage.getItem('engineer_count') || '0', 10);
        else if (user.RoleID == 4) notificationCount.textContent = parseInt(localStorage.getItem('purchasing_count') || '0', 10);
    }

    // Set the notif modal to display the forms
    if (notificationContent) {        
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).startsWith('form-')) {
                // IT WORKS!!! IOT WORKS!!!!!!!!
                const value = localStorage.getItem(localStorage.key(i));
                const pf = JSON.parse(value);

                const list = listSelect(pf);

                const currentYear = new Date().getFullYear();
                const ncrNumber = `${currentYear}-${String(pf.NCRFormID).padStart(3, '0')}`;

                console.log(pf.NCRFormID);
                let txt = `<li><a href="details.html?id=${pf.NCRFormID}" onclick="deleteNotification(${pf.NCRFormID}, '${pf.type}')"> `;
                
                if (pf.type == "Quality") {
                        txt += `${ncrNumber} - ${pf.Details} for ${pf.ItemDescription}. </a></li>`;
                    }
                else if (pf.type == "Engineer") {
                        txt += `${ncrNumber} - ${pf.Review}. </a></li>`;
                    }
                    if (list) {
                        let li = document.createElement('li');
                        li.innerHTML += txt;
                        list.appendChild(li);
                    }
                }
            }
        };
    }


function deleteNotification(id, type) {
    try {
        localStorage.removeItem(`form-${id}-${type}`);

        if (type == "Quality") decrement('quality_count', 'admin_count');
        else if (type == "Engineer") decrement('engineer_count', 'admin_count');
        else if (type == "Purchasing") decrement('purchasing_count', 'admin_count');
    } catch (error) {
        console.error('Failed to delete notification:', error);
        alert("Failed to delete notification.");
    }
}
window.deleteNotification = deleteNotification;

function decrement(type, adminType) {
    let count = parseInt(localStorage.getItem(type) || '0', 10);
    let adminCount = parseInt(localStorage.getItem(adminType) || '0', 10);

    count -= 1;
    localStorage.setItem(type, count);
    adminCount -= 1;
    localStorage.setItem(adminType, adminCount);
}

function listSelect(pf) {
    let newQlt, updatedQlt, closedQlt, newEng, updatedEng;
        if (document.getElementById('new-qlt-list')) {
            newQlt = document.getElementById('new-qlt-list');
            updatedQlt = document.getElementById('updated-qlt-list');
        }
        if (document.getElementById('new-eng-list')) {
            closedQlt = document.getElementById('closed-qlt-list');
            newEng = document.getElementById('new-eng-list');
            updatedEng = document.getElementById('updated-eng-list');
        }

    if (pf.type == "Quality" && newQlt) 
    {
            if (pf.Status == "Closed")
                return closedQlt;
            else if (pf.Status == "Open")
            {
                if (pf.NewOrEdit == "New")
                    return newQlt;
                else if (pf.NewOrEdit == "Edit")
                    return updatedQlt;
            }
        }
    else if (pf.type == "Engineer" && newEng)
    {
            //if (pf.Status == "Closed")
            //    return closedQlt;
            if (pf.Status == "Open")
            {
                if (pf.NewOrEdit == "New")
                    return newEng;
                else if (pf.NewOrEdit == "Edit")
                    return updatedEng;
            }
        }
        else return null;
}

function setupUserView(role) {
    if (role == 1) return;
    else if (role == 2)
    {
        document.getElementById('eng-list').style.display = 'none';
    }
    else if (role == 3)
    {
        document.getElementById('qlt-list').style.display = 'none';
    }
    else if (role == 4)
    {
        document.getElementById('qlt-list').style.display = 'none';
        document.getElementById('eng-list').style.display = 'none';
    }
}