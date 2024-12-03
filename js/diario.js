const entradasDiario = document.getElementById('entradasDiario');
const tituloDiario = document.getElementById('tituloDiario');
const contenidoDiario = document.getElementById('contenidoDiario');
const guardarEntrada = document.getElementById('guardarEntrada');

function cargarEntradas() {
    const entradas = JSON.parse(localStorage.getItem('diario') || '[]');
    entradasDiario.innerHTML = entradas.map(entrada => `
        <div class="entrada">
            <h3>${entrada.titulo}</h3>
            <div class="fecha">${new Date(entrada.fecha).toLocaleString()}</div>
            <p style="white-space: pre-line">${entrada.contenido}</p>
            <small>Escrito por ${entrada.autor}</small>
        </div>
    `).join('');
}

guardarEntrada.addEventListener('click', function() {
    const titulo = tituloDiario.value.trim();
    const contenido = contenidoDiario.value.trim();

    if (titulo && contenido) {
        const entradas = JSON.parse(localStorage.getItem('diario') || '[]');
        entradas.unshift({
            titulo,
            contenido,
            autor: localStorage.getItem('user'),
            fecha: new Date().toISOString()
        });
        localStorage.setItem('diario', JSON.stringify(entradas));
        tituloDiario.value = '';
        contenidoDiario.value = '';
        cargarEntradas();
    }
});

cargarEntradas();