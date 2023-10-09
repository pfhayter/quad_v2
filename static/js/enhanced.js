document.addEventListener("DOMContentLoaded", function() {
    let swiperContainer = document.querySelector('.swiper-container');
    let showSwiperBtn = document.getElementById("showSwiperBtn");
    let scrollTopBtn = document.getElementById("scrollTopBtn");

/*     // Set initial visibility
    swiperContainer.style.display = "none";
    scrollTopBtn.style.display = "none";
 */
/*     showSwiperBtn.addEventListener("click", function() {
        if (swiperContainer.style.display === "none") {
            swiperContainer.style.display = "block";
            scrollTopBtn.style.display = "block";
        } else {
            swiperContainer.style.display = "none";
            scrollTopBtn.style.display = "none";
        }
    });
 */
    scrollTopBtn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById("uploadFormEnhanced").addEventListener("submit", function(event) {
        event.preventDefault();
        let formData = new FormData(this);
        let progressBar = document.getElementById("progressBar");
        let spinner = document.getElementById("spinner");

        // Show progress bar and spinner
        progressBar.style.width = "20%";
        spinner.style.display = "block";
        
        fetch('/uploadEnhanced', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                progressBar.style.width = "100%";
                spinner.style.display = "none";
                setTimeout(() => progressBar.style.width = "0%", 500);

                let previewGrid = document.getElementById("previewGridEnhanced");
                previewGrid.innerHTML = '';

                let allImageURLs = [];

                data.filenames.forEach(filename => {
                    ['tl_', 'tr_', 'bl_', 'br_'].forEach(prefix => {
                        let slideElement = document.createElement("div");
                        slideElement.className = "swiper-slide";
                        
                        let imgURL = "/image/" + prefix + filename.split('/').pop();
                        allImageURLs.push(imgURL);
                        
                        let imgElement = document.createElement("img");
                        imgElement.src = imgURL;
                        
                        slideElement.appendChild(imgElement);
                        previewGrid.appendChild(slideElement);
                    });
                });

                document.body.style.backgroundImage = `url(${allImageURLs[0]})`;
                document.body.style.backgroundRepeat = 'repeat';

                let mySwiper = new Swiper('.swiper-container', {
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    on: {
                        slideChange: function() {
                            document.body.style.backgroundImage = `url(${allImageURLs[this.activeIndex]})`;
                        }
                    }
                });

                let clickTimer;

                document.body.addEventListener("click", function() {
                    if (clickTimer) {
                        clearTimeout(clickTimer);
                    } else {
                        clickTimer = setTimeout(() => {
                            if (mySwiper.isEnd) {
                                document.body.classList.add("shake-effect");
                                setTimeout(() => {
                                    document.body.classList.remove("shake-effect");
                                }, 300);
                            } else {
                                mySwiper.slideNext();
                            }
                            clickTimer = null;
                        }, 300);
                    }
                });

                document.body.addEventListener("dblclick", function() {
                    swiperContainer.classList.toggle("swiper-visible");
                    if (clickTimer) clearTimeout(clickTimer);
                });
            }
        })
        .catch(error => {
            console.error(error);
        });
    });
});
