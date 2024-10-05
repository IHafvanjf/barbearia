let slideIndex = 0;
let slides = document.querySelectorAll(".mySlides");

function showSlides() {
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
        slides[i].classList.remove("exit");
    }

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    slides[slideIndex - 1].classList.add("active");
    slides[(slideIndex - 2 + slides.length) % slides.length].classList.add("exit");

    setTimeout(showSlides, 3000); // Muda a imagem a cada 4 segundos
}

function plusSlides(n) {
    slideIndex += n;
    if (slideIndex < 1) {
        slideIndex = slides.length;
    } else if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    showSlides();
}

window.onload = showSlides;

function recarregarPagina() {
    window.location.reload();
}


// Obter todos os botões de abrir modal
var openModalButtons = document.querySelectorAll('.open-modal');

// Obter todos os modais
var modals = document.querySelectorAll('.modal');

// Obter todos os botões de fechar modal
var closeButtons = document.querySelectorAll('.close');

// Função para abrir o modal
openModalButtons.forEach(button => {
    button.addEventListener('click', function() {
        var modalId = this.getAttribute('data-modal');
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
        }
    });
});

// Função para fechar o modal
closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        var modalId = this.getAttribute('data-modal');
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    });
});

// Fechar o modal quando clicar fora dele
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
});

