document.addEventListener("DOMContentLoaded", () => {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const slider = document.getElementById("slider");
  
    function moveSlide(direction) {
      currentSlide = (currentSlide + direction + slides.length) % slides.length;
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  
    setInterval(() => {
      moveSlide(1);
    }, 5000);
  });
  