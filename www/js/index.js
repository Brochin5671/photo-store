// Wait for device to be ready
document.addEventListener('deviceready', onDeviceReady, false);

// When device is ready, listen for events
function onDeviceReady() {
    // Load gallery
    loadGallery();
    // Listen for camera tab click
    $('a[href="#camera"]').on('click', takePicture);
    // Listen for gallery tab click
    $('a[href="#gallery"]').on('click', cancelPicture);
    // Listen for cancel click
    $('#cancel').on('click', cancelPicture);
}

// Loads the gallery from firebase
function loadGallery() {

    // Refresh gallery
    const gallery = document.getElementById('gallery');
    const list = gallery.querySelectorAll('div.card');
    for(const card of list){
        card.remove();
    }

    // List all images
    storageRef.child('/images').listAll()
        .then((res) => {
            res.items.forEach((itemRef) => {

                // Create card element with image
                const card = document.createElement('div');
                card.className = 'card shadow my-5 mx-auto';
                card.style.width = '18rem';
                card.innerHTML = `
                    <img src="./img/favicon.ico" class="card-img-top" alt="${itemRef.name}">
                    <div class="card-body">
                    <p class="card-text">This location is perfect for a weekend away</p>
                    </div>`;
                gallery.appendChild(card);
                
                // Get each download URL and update img
                storageRef.child(`/images/${itemRef.name}`).getDownloadURL()
                    .then((url) => {
                        card.querySelector('img').src = url;
                    })
                    .catch((err) => {
                        alert(err)
                    });
            });

            // Create default card if no images
            if(!res.items.length){
                const card = document.createElement('div');
                card.className = 'card shadow my-5 mx-auto';
                card.style.width = '18rem';
                card.innerHTML = `
                    <div class="card-body">
                    <p class="card-text">No pictures have been uploaded.</p>
                    </div>`;
                gallery.appendChild(card);
            }
        }).catch((err) => {
            alert(err);
        });
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
    $('#addSpace').removeClass('d-none');

    // Load gallery
    loadGallery();
}

// Takes a picture using the user's device
function takePicture() {
    // Take a picture
    navigator.camera.getPicture((imgUri) => {

        // On success, hide gallery and display image for preview
        $('#gallery').addClass('d-none');
        $('#addSpace').addClass('d-none');
        $('#success').addClass('d-none');
        $('#preview').removeClass('d-none');
        const elem = document.getElementById('imageFile');
        const name = `data:image/jpeg;base64,${imgUri}`
        elem.src = name;

        // Listen for upload click
        $('#upload').on('click', () => {

            // Create a reference for image
            var ref = storageRef.child(`/images/${window.crypto.getRandomValues(new Uint32Array(10)).toString()}`);

            // Convert URI into file object
            let arr = name.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new File([u8arr], 'upload.jpeg', { type: mime });

            // Store file into database
            ref.put(file).then(() => {
                // Toggle success message
                $('#preview').addClass('d-none');
                $('#success').removeClass('d-none');
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