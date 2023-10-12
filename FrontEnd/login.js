// Tente de récupérer l'élément ayant pour identifiant 'loginForm' dans le document.
// Le '?' (appelé optional chaining) est utilisé pour s'assurer que si cet élément n'existe pas, 
// aucune erreur ne sera générée et le code suivant ne sera pas exécuté.
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    // Empêche le comportement par défaut de l'événement de soumission du formulaire, 
    // ce qui empêche la page de se recharger.
    event.preventDefault();

    // Récupère la valeur entrée dans l'élément ayant pour identifiant 'email'.
    const email = document.getElementById('email').value;
    
    // Récupère la valeur entrée dans l'élément ayant pour identifiant 'password'.
    const password = document.getElementById('password').value;

    // Appelle la fonction 'login' avec l'email et le mot de passe récupérés précédemment 
    // pour traiter la connexion.
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
