const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#file-input');
const browseBtn = document.querySelector('.browse-btn');

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
    const files = e.dataTransfer.files;
    if(files.length > 0)
        fileInput.files = files;
})

browseBtn.addEventListener('click', (e) => {
    fileInput.click();
})
