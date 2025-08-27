document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.search-form');
    const input = document.querySelector('.city-input');
    const searchBtn = document.querySelector('.search-btn');

    // Enfocar el input al cargar la página
    if (input) {
        input.focus();
    }

    // Agregar loading state al botón
    if (form) {
        form.addEventListener('submit', function() {
            if (searchBtn) {
                searchBtn.textContent = '🔍 Buscando...';
                searchBtn.disabled = true;
            }
        });
    }

    // Limpiar input cuando se hace clic
    if (input) {
        input.addEventListener('focus', function() {
            if (this.value.trim() === '') {
                this.select();
            }
        });
    }

    console.log('Weather App iniciada! 🌤️');
});