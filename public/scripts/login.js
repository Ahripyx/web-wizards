let user;
document.addEventListener('DOMContentLoaded', async () => {
    user = localStorage.getItem('user');
    if (user != null) {
        localStorage.removeItem('user');
    }
    document.getElementById('login').addEventListener('submit', async () => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log("THIS WORKED AAAAAAH!")

        login(email, password);
    });
});

// Function to login
async function login(email, password) {
    try
    {    
        const response = await fetch('http://localhost:5500/users');
        const data = await response.json();

        data.forEach(user => {
            if (user.Email === email)
            {
                if (user.Password === password)
                {
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = 'index.html';
                }
            }
        });
    }
    catch (error)
    {
        document.getElementById('error').textContent = "Invalid email or password.";
        console.error('Failed to find login:', error);
    }
   
}

function getuser() {
    if (localStorage.getItem('user') == null) {
        return null;
    }
    else
    return JSON.parse(localStorage.getItem('user'));
}