const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#file-input');
const browseBtn = document.querySelector('.browse-btn');

const progressContainer = document.querySelector('.progress-container');
const bgProgress = document.querySelector('.bg-progress');
const progressBar = document.querySelector('.progress-bar');
const percentDiv = document.querySelector('#percent');

const fileURLInput = document.getElementById('fileURL');
const sharingContainer = document.querySelector('.sharing-container');
const clipBtn = document.querySelector('#clip-btn');

// SERVER port
const PORT = 8000;
// change host and upload url
// const host = 'https://innshare.herokuapp.com/';
const host = `http://localhost:${PORT}/`;
const uploadURL = `${host}api/files`;

// transform icon on dragging or droping
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!dropZone.classList.contains('dragged'))
        dropZone.classList.add('dragged');
})

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragged');
})

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragged');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        uploadFile();
    }
});

browseBtn.addEventListener('click', (e) => {
    fileInput.click();
})

clipBtn.addEventListener('click', () => {
    
    fileURLInput.select();

    // Copy the URL to clipboard
    navigator.clipboard.writeText(fileURLInput.value);

    // Alert the clipboard copy
    alert("Successfully Copied URL to clipboard: " + fileURLInput.value);
});

const uploadFile = () => {

    progressContainer.style.display = 'block';
    const file = fileInput.files[0];
    if (!file) {
        console.log('Cannot upload empty file');
        return;
    }

    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            showLink(JSON.parse(xhr.response));
        }
    }

    xhr.upload.onprogress = updateProgress;

    xhr.open('POST', uploadURL);
    xhr.send(formData);

}

fileInput.addEventListener('change', uploadFile);

// monitor progress bar 
const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    console.log(percent);
    bgProgress.style = `width:${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent / 100})`;
}

const showLink = ({ file: url }) => {
    console.log(url);
    progressContainer.style.display = 'none';
    fileURLInput.value = url;
    sharingContainer.style.display = 'block';
}