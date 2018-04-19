var APIURL = "https://triplecrown.azurewebsites.net/";
var fileName;

function startRead(evt) {
    var file = document.getElementById('file').files[0];
    if (file) {
        if (file.type.match("image.*")) {
            getAsImage(file, addImg);
            fileName = file.name;
            alert("Name: " + file.name + "\n" + "Last Modified Date :" + file.lastModifiedDate);
        }
    }
}

function getAsImage(readFile, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(readFile);
    reader.onload = callback;
}

function addImg(imgsrc) {
    var imageFile = document.createElement('img');
    imageFile.setAttribute("src", imgsrc.target.result);
    document.getElementById("preview").insertBefore(imageFile, null);
}

function cleanupAndUpload(imageData){
    var cleanData = imageData.target.result.split("base64,").pop();
    var myData = new FormData();
    myData.append("image", cleanData);
    var request = new XMLHttpRequest();
    var url = APIURL + 'api/image/put/' + fileName;
    request.open("POST", url, true);
    request.send(myData);
}

function upload(){

    // Loop through each of the selected files.
    var fileSelect = document.getElementById('file');
    var files = fileSelect.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        getAsImage(file,cleanupAndUpload);
        // Check the file type.
        if (!file.type.match('image.*')) {
            continue;
        }
    }
}