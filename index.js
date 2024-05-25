const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#file-input');
const browseBtn = document.querySelector('.browse-btn');

// change host and upload url
// const host = 'https://innshare.herokuapp.com/';
const host = '';
const uploadUrl = `${host}api/files`;

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
    if(files.length > 0){
        fileInput.files = files;
        uploadFile();
    }
});

// fileInput.addEventListener('change',()=>{
//     uploadFile();
// });

browseBtn.addEventListener('click', (e) => {
    fileInput.click();
})

const uploadFile = () => {

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('myfile',file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        console.log(xhr.readyState);
        if(xhr.readyState == XMLHttpRequest.DONE){
            console.log('package received');
            console.log(xhr.response);
        }
    }

    xhr.open('POST', uploadUrl);
    xhr.send(formData);
}

fileInput.addEventListener('change', uploadFile);
