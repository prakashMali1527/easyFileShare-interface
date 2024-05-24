const dropZone = document.querySelector('.drop-zone');

// transform icon on dragging or droping
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add('dragged');
})

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragged');
})

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragged');
})

