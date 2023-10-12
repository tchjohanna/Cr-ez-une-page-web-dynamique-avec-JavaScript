// Fonction pour afficher les détails d'un projet
function afficherDetailsProjet(titre, description) {
    const projetDetails = document.querySelector('.project-details-content');
    projetDetails.innerHTML = `
      <h3>${titre}</h3>
      <p>${description}</p>
      <!-- Vous pouvez ajouter d'autres éléments ici selon vos besoins -->
    `;
  }
  
  // Fonction pour afficher les détails du projet en fonction de l'image cliquée
  function showProjectDetails(projet) {
    switch (projet) {
      case 'abajour-tahina':
        afficherDetailsProjet("Abajour Tahina", "Description du projet Abajour Tahina...");
        break;
      case 'appartement-paris-v':
        afficherDetailsProjet("Appartement Paris V", "Description du projet Appartement Paris V...");
        break;
      case 'restaurant-sushisen-londres':
        afficherDetailsProjet("Restaurant Sushisen - Londres", "Description du projet Restaurant Sushisen - Londres...");
        break;
      // Ajout plutard d'autres élements si besoin
      default:
        break;
    }
  }
  
  // Attacher des gestionnaires d'événements aux figures de projet
  document.addEventListener('DOMContentLoaded', () => {
    const liensProjets = document.querySelectorAll('.lien-projet');
  
    liensProjets.forEach(lien => {
      lien.addEventListener('click', () => {
        const projetId = lien.getAttribute('data-projet-id');
        const titreProjet = lien.querySelector('figcaption').textContent;
        const descriptionProjet = ""; // Ajoutez la description du projet ici
  
        afficherDetailsProjet(titreProjet, descriptionProjet, projetId);
      });
    });
  });
  
  