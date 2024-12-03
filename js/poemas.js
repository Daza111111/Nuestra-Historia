const listaPoemas = document.getElementById('listaPoemas');
const tituloPoema = document.getElementById('tituloPoema');
const contenidoPoema = document.getElementById('contenidoPoema');
const guardarPoema = document.getElementById('guardarPoema');

function cargarPoemas() {
    const poemas = JSON.parse(localStorage.getItem('poemas') || '[]');
    listaPoemas.innerHTML = poemas.map(poema => `
        <div class="poema">
            <h3>${poema.titulo}</h3>
            <p style="white-space: pre-line">${poema.contenido}</p>
            <small>Escrito por ${poema.autor} - ${new Date(poema.fecha).toLocaleDateString()}</small>
        </div>
    `).join('');
}

guardarPoema.addEventListener('click', function() {
    const titulo = tituloPoema.value.trim();
    const contenido = contenidoPoema.value.trim();

    if (titulo && contenido) {
        const poemas = JSON.parse(localStorage.getItem('poemas') || '[]');
        poemas.unshift({
            titulo,
            contenido,
            autor: localStorage.getItem('user'),
            fecha: new Date().toISOString()
        });
        localStorage.setItem('poemas', JSON.stringify(poemas));
        tituloPoema.value = '';
        contenidoPoema.value = '';
        cargarPoemas();
    }
});

cargarPoemas();