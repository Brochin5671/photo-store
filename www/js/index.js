// Wait for device to be ready
document.addEventListener('deviceready', onDeviceReady, false);

// When device is ready, listen for events
function onDeviceReady() {
    // Listen for camera tab click
    $('a[href="#camera"]').on('click', takePicture);
    // Listen for gallery tab click
    $('a[href="#gallery"]').on('click', cancelPicture);
    // Listen for cancel click
    $('#cancel').on('click', cancelPicture);
}

// Removes picture from preview and toggles gallery section
function cancelPicture() {
    // Remove preview image
    const elem = document.getElementById('imageFile');
    elem.src = '';
    // Toggle gallery section
    $('#preview').addClass('d-none');
    $('#success').addClass('d-none');
    $('#gallery').removeClass('d-none');
}

// Takes a picture using the user's device
function takePicture() {
    // Take a picture
    navigator.camera.getPicture((imgUri) => {
        // On success, hide gallery and display image for preview
        $('#gallery').addClass('d-none');
        $('#preview').removeClass('d-none');
        const elem = document.getElementById('imageFile');
        const name = `data:image/jpeg;base64,${imgUri}`
        elem.src = name;

        // Listen for upload click
        $('#upload').on('click', () => {
            // Create a reference for image
            var ref = storageRef.child(window.crypto.getRandomValues(new Uint32Array(10)).toString());

            // Convert URI into file object
            let arr = name.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new File([u8arr], 'upload.jpeg', { type: mime });

            // Store file into database
            ref.put(file).then(() => {
                // Toggle gallery section
                $('#preview').addClass('d-none');
                $('#success').removeClass('d-none');
                /*
                $('#gallery').removeClass('d-none');*/
            });
        });
    }, (err) => {
        console.debug(`Unable to obtain picture: ${err}`, "app");
    }, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true,
        popoverOptions: CameraPopoverOptions
    });
}