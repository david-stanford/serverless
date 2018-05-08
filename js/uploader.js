var APIURL = "https://serverless.azurewebsites.net";
var myApp = angular.module('imageApp', []);


myApp.controller('imageController', function($scope, dataService) {
    var imageList = null;
    var slideIndex = 0;

    $scope.loadImages = function(){
        dataService.getData().then(function(dataResponse) {
            $scope.imageList = dataResponse.data;              
        });
    }
    
    $scope.showSlides = function showSlides() {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none"; 
        }
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        } 
        slides[slideIndex-1].style.display = "block"; 
        setTimeout(showSlides, 2000); // Change image every 2 seconds
    } 

    $scope.reload = function() {
        location.reload();
    }
    
    $scope.$on('myRepeatDirective', function (scope, element, attrs) {
        $scope.showSlides();
    });
    
    $scope.loadImages();
  });

myApp.directive('myRepeatDirective', function() {
    return function(scope, element, attrs) {
        if (scope.$last) 
            setTimeout(function () {
                scope.$emit('myRepeatDirective', element, attrs);
            }, 1);
    };
});

myApp.service('dataService', function($http) {
    this.getData = function() {
        return $http({
            method: 'GET',
            url: APIURL + "/api/image/list",
            headers: {'Content-Type': 'application/json'}
            });
        }
});

var fileName;

function startRead(evt) {
    var file = document.getElementById('file').files[0];
    if (file) {
        if (file.type.match("image.*")) {
            getAsImage(file, addImg);
            fileName = file.name;
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
    imageFile.setAttribute("style", "display: block;");
    document.getElementById("preview").insertBefore(imageFile, null);
}

function cleanupAndUpload(imageData){
    var cleanData = imageData.target.result.split("base64,").pop();
    var myData = new FormData();
    myData.append("image", cleanData);
    var request = new XMLHttpRequest();
    var url = APIURL + '/api/image/put/' + fileName;
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