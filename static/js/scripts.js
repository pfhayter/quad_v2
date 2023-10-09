document.addEventListener("DOMContentLoaded", function() {
document.getElementById("uploadForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let formData = new FormData(this);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            let filenames = ['tl_', 'tr_', 'bl_', 'br_'];
            let previewGrid = document.getElementById("previewGrid");
            previewGrid.innerHTML = ''; // Clear previous images

            filenames.forEach(prefix => {
                let slideElement = document.createElement("div");
                slideElement.className = "swiper-slide";
                
                let imgElement = document.createElement("img");
                imgElement.src = "/image/" + prefix + formData.get("file").name;
                
                slideElement.appendChild(imgElement);
                previewGrid.appendChild(slideElement);
            });
            
            // Initialize Swiper after adding the images
            new Swiper('.swiper-container', {
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        }
    })
    .catch(error => {
        console.error("Error uploading image:", error);
    });
})});
