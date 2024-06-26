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

const emailForm = document.querySelector('#email-form');

const notify = document.querySelector('.notify');
const logo = document.querySelector('.logo');

// SERVER port
const PORT = 8000;
const MAX_ALLOWED_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

// change host and upload url
const host = `https://easyfileshare-server.onrender.com/`;
// const host = 'http://localhost:8000/';
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send-email`;

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

    // Nofify the clipboard copy
    showNoty('Link copied!');
});

const uploadFile = () => {

    if(fileInput.files.length > 1){
        fileInput.files = "";
        showNoty('Only upload 1 file!');
        return;
    }

    const file = fileInput.files[0];

    if(file.size > MAX_ALLOWED_FILE_SIZE){
        fileInput.files = "";
        showNoty("Can't upload more than 100 MB");
        return;
    }

    // reset progress container
    bgProgress.style = `width: 0%`;
    percentDiv.innerText = 0;
    progressBar.style.transform = `scaleX(0)`;

    // show progress container
    progressContainer.style.display = 'block';

    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            onUploadSuccess(JSON.parse(xhr.response));
        }
    }

    xhr.upload.onprogress = updateProgress;
    xhr.upload.onerror = () => {
        fileInput.value = "";
        showNoty(`Error in upload: ${xhr.statusText}`);
    }

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

const onUploadSuccess = ({ file: url }) => {
    console.log(url);

    // empty file, once send successfully
    fileInput.value = "";

    // set email btn able to send mail again 
    emailForm[2].removeAttribute('disabled');

    // hide progress container
    progressContainer.style.display = 'none';

    // show url of files
    fileURLInput.value = url;
    sharingContainer.style.display = 'block';
    logo.style.display = 'none';
}

emailForm.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const url = fileURLInput.value;
    const formData = {
        uuid: url.split('/').slice(-1)[0],
        senderEmail: emailForm.elements['senderEmail'].value,
        receiverEmail: emailForm.elements['receiverEmail'].value,
    };

    // after sending mail disabled send button
    emailForm[2].setAttribute('disabled','true');

    let response = await fetch(emailURL, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(formData),
    });
    
    let data = await response.json();
    if(data.success){
        sharingContainer.style.display = 'none';
        logo.style.display = 'block';
        emailForm[0].value = '';
        emailForm[1].value = '';
        showNoty('Email sent!');
    }
})

const showNoty = (msg) =>{
    notify.innerText = msg;
    notify.style.transform = 'translateY(0)';

    setTimeout(()=>{
        notify.style.transform = 'translateY(-60px)';
    },2000);
}