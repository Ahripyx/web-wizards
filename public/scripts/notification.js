let users;

let qlt = null, eng = null;

if (document.getElementById('qlt-list')) {
    qlt = document.getElementById('qlt-list');
}
if (document.getElementById('eng-list')) {
    eng = document.getElementById('eng-list');
}

document.addEventListener("DOMContentLoaded", async function() {

    const response = await fetch('http://localhost:5500/users');
    users = await response.json();
    updateNotification();

    
});

// Function to increment the notification count
export function newNotification(form) {
    try {
        const pf = JSON.parse(form);

        localStorage.setItem(`form-${pf.NCRFormID}-${pf.type}`, form);
        updateNotification();
    } catch (error) {
        console.error('Failed to add notification:', error);
        alert("Failed to add notification." + error);
    }

}

// Function to update the notification modal
function updateNotification() {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = document.getElementById('username');
    if (username) username.textContent = `${user.FName} ${user.MName ? user.MName.charAt(0) + '. ' : ''}${user.LName}`;

    setupUserView(user.RoleID);

    const notificationContent = document.getElementById('notification-content');

    // Set the notif modal to display the forms
    if (notificationContent) {
        qlt.innerHTML = '';
        eng.innerHTML = '';
        let unreadCount = 0;
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).startsWith('form-')) {
                // IT WORKS!!! IOT WORKS!!!!!!!!
                const value = localStorage.getItem(localStorage.key(i));
                const pf = JSON.parse(value);

                const list = listSelect(pf);
                list.innerHTML = '';

                const currentYear = new Date().getFullYear();
                const ncrNumber = `${currentYear}-${String(pf.NCRFormID).padStart(3, '0')}`;

                let div = document.createElement('div');
                div.className = 'list-group';

                let a = document.createElement('a');
                a.href = `details.html?id=${pf.NCRFormID}`;
                a.className = 'list-group-item list-group-item-action flex-column align-items-start';
                a.onclick = function() { notificationRead(pf); };

                if (pf.Read == false)
                {
                    a.className += ` active`;
                    unreadCount++;
                }
                    

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
                if (pf.type === "Quality") {
                    p.textContent = `NCR#: ${ncrNumber} - ${pf.Details} for ${pf.ItemDescription}`;
                } else if (pf.type === "Engineer") {
                    p.textContent = `NCR#: ${ncrNumber} - ${pf.Review}`;
                } else if (pf.type === "Purchasing") {
                    p.textContent = `NCR#: ${ncrNumber} - ${pf.Decision}`;
                }

                let smallDate = document.createElement('small');
                smallDate.textContent = pf.LastModified;

                let btnDelete = document.createElement('button');
                btnDelete.className = 'btn btn-danger';
                btnDelete.textContent = "X";
                btnDelete.onclick = function() { deleteNotification(pf.NCRFormID, pf.type); }

                div.appendChild(btnDelete);
                divInner.appendChild(h5);
                divInner.appendChild(small);
                a.appendChild(divInner);
                a.appendChild(p);
                a.appendChild(smallDate);
                div.appendChild(a);

                list.appendChild(div);
                }
            }
            if (unreadCount > 0)
                document.getElementById('unread-count').textContent = unreadCount;
        };
    }


function deleteNotification(id, type) {
    try {
        localStorage.removeItem(`form-${id}-${type}`);
        updateNotification();
    } catch (error) {
        console.error('Failed to delete notification:', error);
    }
}

window.deleteNotification = deleteNotification;

function notificationRead(pf) {
    try {
        pf.Read = true;
        localStorage.setItem(`form-${pf.NCRFormID}-${pf.type}`, JSON.stringify(pf));
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
    }
}
window.notificationRead = notificationRead;

function listSelect(pf) {
    if (pf.type == "Quality") 
    {
            if (pf.Status == "Closed")
                return eng;
            else if (pf.Status == "Open")
            {
                return qlt;
            }
        }
    else if (pf.type == "Engineer")
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