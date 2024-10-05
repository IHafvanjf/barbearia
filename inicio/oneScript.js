let slideIndex = 0;


function showSlides() {
    let slides = document.querySelectorAll(".mySlides");
    slides.forEach(slide => {
        slide.classList.remove("active");
        slide.classList.remove("exit");
    });

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex - 1].classList.add("active");
    slides[(slideIndex - 2 + slides.length) % slides.length].classList.add("exit");
    setTimeout(showSlides, 4000);
}
showSlides();

// Carrossel de imagens dos clientes
let newSlideIndex = 0;
const slidesWrapper = document.querySelector(".slides-wrapper");
const totalSlides = document.querySelectorAll(".mySlides-new").length / 2;
const slideWidth = document.querySelector(".mySlides-new").offsetWidth + parseInt(getComputedStyle(document.querySelector(".mySlides-new")).marginRight);

function showSlidesNew(n) {
    newSlideIndex += n;
    if (newSlideIndex >= totalSlides) newSlideIndex = 0;
    if (newSlideIndex < 0) newSlideIndex = totalSlides - 1;

    slidesWrapper.style.transform = `translateX(-${newSlideIndex * slideWidth}px)`;
}

function plusSlidesNew(n) {
    showSlidesNew(n);
}

// Scroll suave localização
document.querySelector('.localizacao').addEventListener('click', function (e) {
    e.preventDefault();
    scrollToSmoothly(document.documentElement.scrollHeight, 3500); // 1000ms = 1 segundo
});

function scrollToSmoothly(pos, duration) {
    const start = window.pageYOffset;
    const distance = pos - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation); // Inicia a animação
}

document.querySelector('.produtos').addEventListener('click', function (e) {
    e.preventDefault();
    
    // Obtém a posição do elemento '#Produtos' em relação ao topo da página
    const produtosSection = document.getElementById('imgProduto2');
    const offsetTop = produtosSection.offsetTop;
    
    // Rola suavemente até a posição do elemento
    scrollToSmoothly(offsetTop, 1000); // 1000ms = 1 segundo

    requestAnimationFrame(animation); // Inicia a animação
});


function scrollToSmoothly(pos, duration) {
    const start = window.pageYOffset;
    const distance = pos - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Redirecionamento do botão Agendar
document.getElementById("agendarBtn").addEventListener("click", function() {
    console.log("Botão de agendamento clicado"); // Verifica se o clique está sendo detectado
    window.location.href = "agendamento/index.html";
});

// Funções dos Modais
function openModal(myModal1) {
    const modal1 = document.getElementById(myModal1);
    if (modal1) {
        modal1.style.display = 'block';
    }
}

function recarregarPagina(){
    window.location.reload();
}

// Função para abrir o modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Função para fechar o modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Obter todos os botões de abrir modal
document.querySelectorAll('button[id^="botaoversobre"]').forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.id.replace('botaoversobre', 'modalPessoa');
        openModal(modalId);
    });
});

// Obter todos os botões de fechar modal
document.querySelectorAll('.modal .close').forEach(span => {
    span.addEventListener('click', () => {
        const modalId = span.getAttribute('data-modal');
        closeModal(modalId);
    });
});

// Fechar o modal quando clicar fora dele
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});
