// Wait for device to be ready
document.addEventListener('deviceready', onDeviceReady, false);

// When device is ready, listen for events
function onDeviceReady() {
    // Listen for camera tab click
    $('a[href="#camera"]').on('click', takePicture);
    // Listen for gallery tab click
    $('a[href="#gallery"]').on('click', (event) => {
        console.log('gallery');
    });
}

// Takes a picture using the user's device
function takePicture(){
    navigator.camera.getPicture((imgUri) => {
        const elem = document.getElementById('imageFile');
        elem.src = `data:image/jpeg;base64,${imgUri}`;
    }, (err) => {
        console.debug(`Unable to obtain picture: ${err}`, "app");
    }, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true
    });
}