import { db, storage } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const galeriaRecuerdos = document.getElementById('galeriaRecuerdos');
const tituloRecuerdo = document.getElementById('tituloRecuerdo');
const descripcionRecuerdo = document.getElementById('descripcionRecuerdo');
const fechaRecuerdo = document.getElementById('fechaRecuerdo');
const mediaFile = document.getElementById('mediaFile');
const previewContainer = document.getElementById('previewContainer');
const guardarRecuerdo = document.getElementById('guardarRecuerdo');

let selectedFiles = [];

// Drag and drop functionality
const uploadLabel = document.querySelector('.upload-label');

uploadLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadLabel.style.borderColor = '#ff6b6b';
    uploadLabel.style.background = 'rgba(255, 107, 107, 0.1)';
});

uploadLabel.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadLabel.style.borderColor = '#ffb3b3';
    uploadLabel.style.background = 'transparent';
});

uploadLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadLabel.style.borderColor = '#ffb3b3';
    uploadLabel.style.background = 'transparent';
    
    const files = Array.from(e.dataTransfer.files);
    const mediaFiles = files.filter(file => 
        file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (mediaFiles.length > 0) {
        selectedFiles = [...selectedFiles, ...mediaFiles];
        updatePreview();
    }
});

mediaFile.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    selectedFiles = [...selectedFiles, ...files];
    updatePreview();
}

function updatePreview() {
    previewContainer.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const preview = document.createElement('div');
        preview.className = 'preview-item animate__animated animate__fadeIn';
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.controls = true;
            preview.appendChild(video);
        }

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-preview';
        removeButton.innerHTML = '×';
        removeButton.onclick = () => removeFile(index);
        preview.appendChild(removeButton);

        previewContainer.appendChild(preview);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updatePreview();
}

function createCarousel(mediaUrls) {
    const swiperContainer = document.createElement('div');
    swiperContainer.className = 'swiper';
    
    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';
    
    mediaUrls.forEach(url => {
        const swiperSlide = document.createElement('div');
        swiperSlide.className = 'swiper-slide';
        
        if (url.includes('.mp4')) {
            const video = document.createElement('video');
            video.src = url;
            video.controls = true;
            swiperSlide.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Recuerdo';
            swiperSlide.appendChild(img);
        }
        
        swiperWrapper.appendChild(swiperSlide);
    });
    
    swiperContainer.appendChild(swiperWrapper);
    
    // Add navigation
    const prevButton = document.createElement('div');
    prevButton.className = 'swiper-button-prev';
    const nextButton = document.createElement('div');
    nextButton.className = 'swiper-button-next';
    const pagination = document.createElement('div');
    pagination.className = 'swiper-pagination';
    
    swiperContainer.appendChild(prevButton);
    swiperContainer.appendChild(nextButton);
    swiperContainer.appendChild(pagination);
    
    return swiperContainer;
}

async function cargarRecuerdos() {
    const recuerdosRef = collection(db, 'recuerdos');
    const q = query(recuerdosRef, orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);
    
    galeriaRecuerdos.innerHTML = '';
    querySnapshot.forEach(doc => {
        const recuerdo = doc.data();
        const element = document.createElement('div');
        element.className = 'recuerdo animate__animated animate__fadeIn';
        
        if (recuerdo.mediaUrls && recuerdo.mediaUrls.length > 0) {
            const carousel = createCarousel(recuerdo.mediaUrls);
            element.appendChild(carousel);
        }
        
        const content = document.createElement('div');
        content.className = 'recuerdo-content';
        content.innerHTML = `
            <h3>${recuerdo.titulo}</h3>
            <p>${recuerdo.descripcion}</p>
            <small>${new Date(recuerdo.fecha).toLocaleDateString()}</small>
            <p>Compartido por: ${recuerdo.autor}</p>
        `;
        
        element.appendChild(content);
        galeriaRecuerdos.appendChild(element);
        
        // Initialize Swiper
        if (recuerdo.mediaUrls && recuerdo.mediaUrls.length > 0) {
            new Swiper(element.querySelector('.swiper'), {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                loop: true,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                }
            });
        }
    });
}

guardarRecuerdo.addEventListener('click', async function() {
    const titulo = tituloRecuerdo.value.trim();
    const descripcion = descripcionRecuerdo.value.trim();
    const fecha = fechaRecuerdo.value;

    if (titulo && descripcion && fecha) {
        const originalButtonText = guardarRecuerdo.innerHTML;
        guardarRecuerdo.disabled = true;
        guardarRecuerdo.innerHTML = '<span class="button-icon">⏳</span><span>Guardando...</span>';

        try {
            const mediaUrls = [];
            for (const file of selectedFiles) {
                const storageRef = ref(storage, `recuerdos/${Date.now()}-${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                mediaUrls.push(url);
            }

            await addDoc(collection(db, 'recuerdos'), {
                titulo,
                descripcion,
                fecha,
                mediaUrls,
                autor: localStorage.getItem('user'),
                timestamp: new Date().toISOString()
            });

            tituloRecuerdo.value = '';
            descripcionRecuerdo.value = '';
            fechaRecuerdo.value = '';
            selectedFiles = [];
            previewContainer.innerHTML = '';
            await cargarRecuerdos();
        } catch (error) {
            console.error('Error al guardar el recuerdo:', error);
            alert('Error al guardar el recuerdo. Por favor, intenta de nuevo.');
        } finally {
            guardarRecuerdo.disabled = false;
            guardarRecuerdo.innerHTML = originalButtonText;
        }
    }
});

cargarRecuerdos();