const mensajesContainer = document.getElementById('mensajesContainer');
const nuevoMensaje = document.getElementById('nuevoMensaje');
const enviarMensaje = document.getElementById('enviarMensaje');

function cargarMensajes() {
    const mensajes = JSON.parse(localStorage.getItem('mensajes') || '[]');
    mensajesContainer.innerHTML = mensajes.map(mensaje => `
        <div class="mensaje">
            <strong>${mensaje.autor}</strong>
            <p>${mensaje.texto}</p>
            <small>${new Date(mensaje.fecha).toLocaleString()}</small>
        </div>
    `).join('');
}

enviarMensaje.addEventListener('click', function() {
    const texto = nuevoMensaje.value.trim();
    if (texto) {
        const mensajes = JSON.parse(localStorage.getItem('mensajes') || '[]');
        mensajes.unshift({
            autor: localStorage.getItem('user'),
            texto: texto,
            fecha: new Date().toISOString()
        });
        localStorage.setItem('mensajes', JSON.stringify(mensajes));
        nuevoMensaje.value = '';
        cargarMensajes();
    }
});

cargarMensajes();