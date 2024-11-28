let users;
document.addEventListener("DOMContentLoaded", async function() {

    const response = await fetch('http://localhost:5500/users');
    users = await response.json();
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
    const username = document.getElementById('username');
    if (username) username.textContent = `${user.FName} ${user.MName ? user.MName.charAt(0) + '. ' : ''}${user.LName}`;

    const notificationCount = document.getElementById('notification-count');

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

                let div = document.createElement('div');
                div.className = 'list-group';

                let a = document.createElement('a');
                a.href = `details.html?id=${pf.NCRFormID}`;
                a.className = 'list-group-item list-group-item-action flex-column align-items-start';
                //a.onclick = function() { deleteNotification(pf.NCRFormID, pf.type); };

                let divInner = document.createElement('div');
                divInner.className = 'd-flex w-100 justify-content-between';

                let h5 = document.createElement('h5');
                h5.className = 'mb-1';
                let status;
                if (pf.NewOrEdit == "New" || pf.Status == "Closed")
                    status = "released";
                else
                    status = "updated";
                
                h5.textContent = `${pf.type} form ${status}`;

                let small = document.createElement('small');
                const user = users.find(u => u.id === pf.UserID);
                if (user) {
                    small.textContent = `by ${user.FName} ${user.MName ? user.MName.charAt(0) + '. ' : ''}${user.LName}`;
                }

                let p = document.createElement('p');
                p.className = 'mb-1';
                p.textContent = `NCR#: ${ncrNumber} - ${pf.Details || pf.Review} for ${pf.ItemDescription || ''}`;

                let smallDate = document.createElement('small');
                smallDate.textContent = pf.LastModified;

                divInner.appendChild(h5);
                divInner.appendChild(small);
                a.appendChild(divInner);
                a.appendChild(p);
                a.appendChild(smallDate);
                div.appendChild(a);

                list.appendChild(div);
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
    let qlt, eng;
        if (document.getElementById('qlt-list')) {
            qlt = document.getElementById('qlt-list');
        }
        if (document.getElementById('eng-list')) {
            eng = document.getElementById('eng-list');
        }

    if (pf.type == "Quality") 
    {
            if (pf.Status == "Closed")
                return eng;
            else if (pf.Status == "Open")
            {
                return qlt;
            }
        }
    else if (pf.type == "Engineer" && newEng)
    {
            //if (pf.Status == "Closed")
            //    return closedQlt;
            if (pf.Status == "Open")
            {
                return eng;
            }
        }
        else return null;
}

function setupUserView(role) {
    if (role == 2 || role == 1)
    {
        document.getElementById('li-create').style.display = 'block';
        document.getElementById('qlt-list').style.display = 'block';
    }
    if (role == 3 || role == 1)
    {
        document.getElementById('eng-list').style.display = 'block';
    }
    if (role == 4 || role == 1)
    {
        document.getElementById('qlt-list').style.display = 'block';
        document.getElementById('eng-list').style.display = 'block';
    }
    if (role == 1)
    {
        document.getElementById('li-tools').style.display = 'block';
    }
}