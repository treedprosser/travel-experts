// javascript for the image carousel on the travel package page - TP

//Select all slides
const slides = document.querySelectorAll(".slide");

//loop through slides and set each slides translateX property to index * 100%
slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${index * 100}%)`;
});

//current slide counter
let curSlide = 0;

//select next slide button
const nextSlide = document.querySelector(".btn-next");

//select prev slide button
const prevSlide = document.querySelector(".btn-prev");

//set max number of slides
let maxSlides = slides.length - 1;

//add event listener and next slide function
nextSlide.addEventListener("click", () => {
    //check if current slide is the last and reset current slide
    if (curSlide == maxSlides) {
        curSlide = 0;
    } else {
        curSlide++;
    }

    // move slides
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
    });
});

//add event listener and prev slide function
prevSlide.addEventListener("click", () => {
    //check if current slide is the first and reset current slide to last
    if (curSlide === 0) {
        curSlide = maxSlides;
    } else {
        curSlide--;
    }

    // move slides
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
    });
});