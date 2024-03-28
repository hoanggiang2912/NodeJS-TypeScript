$(document).ready(function () {
    if ($('.category__wrapper').length > 0) {
        const categorySlider = new Flickity('.category__wrapper', {
            cellAlign: 'left',
            contain: true,
            prevNextButtons: true,
            pageDots: true,
            groupCells: true,
            wrapAround: true,
            autoPlay: 5000,
            pauseAutoPlayOnHover: true,
            draggable: true,
            imagesLoaded: true,
            percentPosition: true,
            selectedAttraction: 0.1,
            friction: 0.8,
            lazyLoad: 2,
            responsive: {
                0: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    prevNextButtons: false, // Hide prev/next buttons on smaller screens
                    pageDots: false // Hide page dots on smaller screens
                },
                768: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    prevNextButtons: true, // Show prev/next buttons on tablet
                    pageDots: true // Show page dots on tablet
                },
                1024: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    prevNextButtons: true, // Show prev/next buttons on larger screens
                    pageDots: true // Show page dots on larger screens
                }
            }
        });
        // Disable draggable for larger screens
        if (window.matchMedia("(min-width: 1024px)").matches) {
            categorySlider.options.draggable = false;
        }
    }
    if ($('.benefit__wrapper').length > 0) {
        const categorySlider = new Flickity('.benefit__wrapper', {
            cellAlign: 'left',
            contain: true,
            prevNextButtons: true,
            pageDots: true,
            groupCells: true,
            wrapAround: true,
            autoPlay: 5000,
            pauseAutoPlayOnHover: true,
            draggable: true,
            imagesLoaded: true,
            percentPosition: true,
            selectedAttraction: 0.1,
            friction: 0.8,
            lazyLoad: 2,
            responsive: {
                0: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    prevNextButtons: false, // Hide prev/next buttons on smaller screens
                    pageDots: false // Hide page dots on smaller screens
                },
                768: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    prevNextButtons: true, // Show prev/next buttons on tablet
                    pageDots: true // Show page dots on tablet
                },
                1024: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    prevNextButtons: false, // Show prev/next buttons on larger screens
                    pageDots: false // Show page dots on larger screens
                }
            }
        });
        // Disable draggable for larger screens
        if (window.matchMedia("(min-width: 1024px)").matches) {
            categorySlider.options.draggable = false;
        }
    }
    // if ($('.new__arrival__wrapper').length > 0) {
    //     const categorySlider = new Flickity('.new__arrival__wrapper', {
    //         cellAlign: 'left',
    //         contain: true,
    //         prevNextButtons: true,
    //         pageDots: true,
    //         groupCells: true,
    //         wrapAround: true,
    //         autoPlay: 5000,
    //         pauseAutoPlayOnHover: true,
    //         draggable: true,
    //         imagesLoaded: true,
    //         percentPosition: true,
    //         selectedAttraction: 0.1,
    //         friction: 0.8,
    //         lazyLoad: 2,
    //         responsive: {
    //             0: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1,
    //                 prevNextButtons: false, // Hide prev/next buttons on smaller screens
    //                 pageDots: false // Hide page dots on smaller screens
    //             },
    //             768: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //                 prevNextButtons: true, // Show prev/next buttons on tablet
    //                 pageDots: true // Show page dots on tablet
    //             },
    //             1024: {
    //                 slidesToShow: 6,
    //                 slidesToScroll: 1,
    //                 prevNextButtons: false, // Show prev/next buttons on larger screens
    //                 pageDots: false // Show page dots on larger screens
    //             }
    //         }
    //     });
    //     // Disable draggable for larger screens
    //     if (window.matchMedia("(min-width: 1024px)").matches) {
    //         categorySlider.options.draggable = false;
    //     }
    // }
    // if ($('.gallery__spotlight')) {
    //     // Initialize Flickity for spotlight image
    //     var spotlight = new Flickity('.gallery__spotlight', {
    //         cellAlign: 'left',
    //         contain: true,
    //         wrapAround: true,
    //         prevNextButtons: false,
    //         pageDots: false
    //     });

    //     // Handle Flickity change event
    //     spotlight.on('change', function () {
    //         var currentSlideIndex = spotlight.selectedIndex;
    //         var thumbnails = document.querySelectorAll('.gallery__thumbnail');
    //         var spotlightHolders = document.querySelectorAll('.gallery__spotlight__holder');

    //         // Highlight the current thumbnail
    //         thumbnails.forEach(function (thumbnail, index) {
    //             thumbnail.classList.remove('active');
    //             if (index === currentSlideIndex) {
    //                 thumbnail.classList.add('active');
    //             }
    //         });

    //         // Delay the addition of fade-in class to spotlight image holder
    //         setTimeout(function () {
    //             spotlightHolders.forEach(function (holder, index) {
    //                 if (index === currentSlideIndex) {
    //                     holder.classList.add('fade-in');
    //                 } else {
    //                     holder.classList.remove('fade-in');
    //                 }
    //             });
    //         }, 300); // Adjust the delay duration as needed
    //     });

    //     // Handle thumbnail click event
    //     var thumbnails = document.querySelectorAll('.gallery__thumbnail');
    //     thumbnails.forEach(function (thumbnail, index) {
    //         thumbnail.addEventListener('click', function () {
    //             spotlight.select(index);
    //         });
    //     });

    //     // Handle swipe event
    //     spotlight.on('dragEnd', function () {
    //         var direction = spotlight.x < 0 ? 'next' : 'previous';
    //         if (spotlight.isFreeScrolling) {
    //             var currentSlideIndex = spotlight.selectedIndex;
    //             var numSlides = spotlight.slides.length;

    //             // Infinite loop for swipe
    //             if (direction === 'next' && currentSlideIndex === numSlides - 1) {
    //                 spotlight.select(0);
    //             } else if (direction === 'previous' && currentSlideIndex === 0) {
    //                 spotlight.select(numSlides - 1);
    //             }
    //         }
    //     });
    // }

});