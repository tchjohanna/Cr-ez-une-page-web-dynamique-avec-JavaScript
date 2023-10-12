let allWorks = [];
let allCategory = [];



console.log('hello');
// on récupère les différents travaux effectués par l'architecte
function fetchWorks (){
    fetch('http://localhost:5678/api/works').then((response) => {
        return response.json()
    }).then((data)=>{
        console.log(data);
        allWorks = data;
        displayWorks(allWorks);
        console.log(allWorks);
    }) 

}
//on récupère les différents travaux effectués par l'architecte 
fetchWorks();

function displayWorks (works){
    const contentProject = document.querySelector('.gallery');
    contentProject.innerHTML = works.map (work => {
        return `
                    <figure class="lien-projet" data-projet-id="${work.id}">
                        <img src="${work.imageUrl}" alt="${work.title}">
                        <figcaption>${work.title}</figcaption>
                    </figure>`
      }).join('');
}

//on récupère les différentes catégories
function fetchCategory() {
    // Implémentez ici la récupération des catégories via fetch() ou autre
    // Renvoyez les catégories (par exemple, en tant que Promesse résolue)
    fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
        allCategory = data;
        console.log(allCategory);
        displayCategories(allCategory);
        setSelectCategory();
    })
}

function displayCategories(categories) {
    const contentCategories = document.querySelector('.categories');
    const categoriesHTML = categories.map(category => {
        return `<button class="category" data-id="${category.id}">${category.name}</button>`;
    }).join('');
    contentCategories.innerHTML += categoriesHTML;
    const buttonCategory = document.querySelectorAll('.category');
    buttonCategory.forEach(button => {
        button.addEventListener("click",(event) => {
            console.log(event);
            const id = parseInt(event.target.dataset.id);
            filterWorks(id);
        });
        
    });
}

function filterWorks(id){
    if(id===0){
        displayWorks(allWorks);
        return;//return va stopper la fonction
    }
    const worksfiltered = allWorks.filter(work => {
        return work.categoryId === id;

    })
    console.log(worksfiltered);
    displayWorks(worksfiltered);
};


// Appel de la fonction pour récupérer les catégories
fetchCategory()
   
const btnUpdate = document.querySelector('.btn-update');
const token = localStorage.getItem('token');//on récupere le token 
if (token) {
    btnUpdate.style.display = 'inline-block';
}

// pour supprimer un work
const deleteWork = (id) => {
    // requete pour supprimer
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            // on met le token pour montrer au backend que nous sommes autorisé
            authorization: `Bearer ${localStorage.token}`
        }
    }).then(() => {
        // on filtre le tableau allWork en supprimant le work qui a été supprimé par notre requette
       allWorks = allWorks.filter((work) => {
        return work.id != id
       })
       // on met a jour l'affichage avec le nouveau tableau mis à jour sans les le work supprimé
       displayWorks(allWorks)
       displayWorkModal()
    })
}
const displayWorkModal = () => {
    const containerGallery = document.querySelector(".container-gallery")
    // j'injecte tous les works dans la modal et je met un data-id pour stocker l'id et pouvoir l'utilise pour supprimer le work
    containerGallery.innerHTML = allWorks.map((work) => {
        return `
            <div class="work-item">
                <img src="${work.imageUrl}" alt="image ${work.title}">
                <span class="content-btn-delete" data-id="${work.id}">
                    <i class="fas fa-trash-alt" data-id="${work.id}"></i>
                </span>
            </div>
        `
    }).join("")

    const allBtnDelete = document.querySelectorAll('.content-btn-delete')
    allBtnDelete.forEach((btnDelete) => {
        btnDelete.addEventListener("click", (event) => {
            console.log("delete ?")
            console.log(event.target.dataset.id)
            // on appel la function deleteWork pour supprimer le work on lui passe le id du dataset de l'élément où on a cliqué
            deleteWork(event.target.dataset.id)
        })
    })
}

const overlay = document.querySelector('.overlay');
// ouvrir la modal si on clique sur le btn modifier
btnUpdate.addEventListener('click', function(){
    overlay.style.display = 'flex';
    displayWorkModal()
    // on ajout un event pour fermer la modal si on clique sur le btn close
    const btnClose = document.querySelector('.fa-times');
    btnClose.addEventListener('click', function() {
        overlay.style.display = 'none';
      })
})

const btnAdd = document.querySelector('.add');
const modalDelete = document.querySelector('.modal-delete');
const modalAdd = document.querySelector('.modal-add');
const btnCloseAll = document.querySelectorAll('.petite-croix');

//fermer la modal si on clique sur le btn close
btnCloseAll.forEach(btnClose => {
    btnClose.addEventListener('click', function(){
        overlay.style.display = 'none';
        modalDelete.style.display = 'block';
        modalAdd.style.display = 'none';

    })
})
//ouvrir la modal si on clique sur le btn ajouter
btnAdd.addEventListener('click', function(){
    modalDelete.style.display = 'none';
    modalAdd.style.display = 'block';
})

const btnBack = document.querySelector('.back');
// retourner en arrirère si on clique sur le btn back
btnBack.addEventListener('click', function(){
    modalDelete.style.display = 'block';
    modalAdd.style.display = 'none';
})
const selectCategory = document.querySelector('#category');
const inputTitle = document.querySelector('#title');
const inputFile = document.querySelector('#image');
const contentInputImage = document.querySelector('.content-input-image');

// on regarder les changements sur le select category
selectCategory.addEventListener('change', function(){
    validate();
});
// on regarder les changements sur le input title
inputTitle.addEventListener('change', function(){
    validate(); 
});

// on regarder les changements sur le input file
inputFile.addEventListener('change', function(){
    previewFile();
    validate();
});
//ajouter les catégories dans le select
const setSelectCategory = () => {
    allCategory.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        selectCategory.appendChild(option);
    });
}
const formAdd = document.querySelector('.form-add');
//ajouter un work
formAdd.addEventListener('submit', function(event){
    event.preventDefault();
    // on récupere les valeurs du formulaire
    const title = document.querySelector('#title').value;
    const category = document.querySelector('#category').value;
    const image = document.querySelector('#image').files[0];
    // on crée un objet formData pour envoyer les données
    const formData = new FormData();
    // on ajoute les données dans l'objet formData
    formData.append('title', title);
    formData.append('category', parseInt(category));
    formData.append('image', image);

    // on envoie les données au backend
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            authorization: `Bearer ${localStorage.token}`,
        },
        body: formData
    }).then((response) => {
        return response.json();
    }).then((result) => {
        console.log(result);
        // on ajoute le nouveau work dans le tableau allWorks
        allWorks.push(result);
        // on met a jour l'affichage
        displayWorks(allWorks);
        // on ferme la modal
        overlay.style.display = 'none';
        modalDelete.style.display = 'block';
        modalAdd.style.display = 'none';
        // nettoyer le formulaire
        formAdd.reset();
        // on remet l'image par defaut
        preview.src = 'assets/images/placeholder.png';
        contentInputImage.style.display = 'block';
    }).catch((error) => {
        console.log(error);
    })
})

// validation des champs du formulaire
const validate = () => {
    // on récupere les valeurs des champs
    const valueTitle = document.querySelector('#title').value;
    const valueCategory = document.querySelector('#category').value;
    const valueFile = document.querySelector('#image').value;

    //si les champs sont remplis on active le btn ajouter sinon on le desactive
    if(valueTitle && valueCategory && valueFile){
        document.querySelector('.btn-save').disabled = false;
    } else {
        document.querySelector('.btn-save').disabled = true;
    }
}

// preview image
const previewFile = () => {
    // on récupere l'élément img
    const preview = document.querySelector('#preview');
    // on récupere l'élément input file
    const file = document.querySelector('#image').files[0];
    // on crée un objet FileReader
    const reader = new FileReader();
    // on ajoute un event pour afficher l'image
    reader.addEventListener("load", function () {
        preview.src = reader.result;
        preview.style.display = 'inline-block';
        contentInputImage.style.display = 'none';

    }, false);
    // si on a bien un fichier on lit le fichier
    if (file) {
        reader.readAsDataURL(file);
    }
}

