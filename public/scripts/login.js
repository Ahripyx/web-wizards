document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('login').addEventListener('submit', async () => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email, password);
    });
});

// Function to login
async function login(email, password) {
    try
    {    
        let user = localStorage.getItem('user');

        if (user != null) {
            localStorage.removeItem('user');
        }

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

        document.getElementById('error').textContent = "Invalid email or password.";
    }
    catch (error)
    {
        console.error('Failed to find user:', error);
        alert("Failed to find user.");
    }
   
}