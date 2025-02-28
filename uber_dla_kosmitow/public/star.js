
document.addEventListener("DOMContentLoaded", () => {
    const starsContainer = document.getElementById("stars-container");

    
    const numberOfStars = 200;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        // Losowe rozmiary gwiazdek 
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Losowe pozycje gwiazdek
        const x = Math.random() * 100; 
        const y = Math.random() * 100; 
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;

        
        const delay = Math.random() * 2;
        star.style.animationDelay = `${delay}s`;

        starsContainer.appendChild(star);
    }
});