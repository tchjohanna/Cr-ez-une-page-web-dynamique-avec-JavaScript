document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
});

function login(email, password) {
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        toggleLoginState(true); // Ajouté
        alert('Login successful');
        window.location.href = '/'; // Redirect to the main page after successful login.
    })
    .catch(error => {
        document.getElementById('loginError').textContent = 'Login failed. Please check your credentials.';
    });
}

// Ajout fonction de déconnexion :
//function logout() {
//    localStorage.removeItem('token'); 
////    toggleLoginState(false); // Ajouté
 //   alert('Déconnexion réussie');
 //   window.location.href = '/login'; 
//}

// Ajout fonction de déconnexion :
function logout() {
    localStorage.removeItem('token'); 
    toggleLoginState(false); // Ajouté
    alert('Déconnexion réussie');
    window.navigation.reload()  // Modifié ici
}





// Ajout d' un écouteur d'événements pour le bouton de déconnexion :
document.getElementById('logoutBtn')?.addEventListener('click', logout);

// Ajout d'une fonction pour gérer l'affichage/masquage des boutons de connexion et de déconnexion
function toggleLoginState(isLoggedIn) {
    const loginItem = document.getElementById('loginItem');
    const logoutItem = document.getElementById('logoutBtn').parentNode; // Assumant que le bouton est dans un élément parent (comme <li>)

    if (isLoggedIn) {
        loginItem.style.display = 'none';
        logoutItem.style.display = 'block';
    } else {
        loginItem.style.display = 'block';
        logoutItem.style.display = 'none';
    }
}

// Vérifier l'état de connexion au chargement de la page
window.addEventListener('DOMContentLoaded', (event) => {
    const isLoggedIn = !!localStorage.getItem('token'); // Convertit en valeur booléenne : true si le token existe, false sinon
    toggleLoginState(isLoggedIn);
});
