let PlayerCreated = false;
let Player;
let PlayerSize = 20
let GameRunning = true
let Score = 0

const Fullscreen = document.getElementById('Fullscreen')
const StartingScreen = document.getElementById('StartingScreen');
const ScoreElement = document.getElementById('ScoreElement');
ScoreElement.innerText = `${Score}`;
document.body.appendChild(ScoreElement);


// Function to request fullscreen
function enterFullscreen() {
    const body = document.body;
    if (body.requestFullscreen) {
        body.requestFullscreen();
    } else if (body.webkitRequestFullscreen) { // Chrome, Safari, Opera
        body.webkitRequestFullscreen()}}

        Fullscreen.addEventListener('click', function () {
            enterFullscreen(); // Enter fullscreen when clicked
        
            // Hide the fullscreen button after clicking
            Fullscreen.style.display = 'none';
        
            // Start the game when fullscreen is activated
            StartingScreen.style.display = 'none'; // Hide the starting screen
            GameRunning = true;
            
            // Optionally, hide the cursor and start the game logic
            document.documentElement.style.cursor = 'none';
        });


document.addEventListener('click', function () {
    StartingScreen.style.display = 'none';

    if (!GameRunning) { return; }

    // Loob mängija ainult ühe korra
    if (!PlayerCreated) {
        Player = document.createElement('div');
        Player.classList.add('Player');
        Player.style.width = `${PlayerSize}px`;
        Player.style.height = `${PlayerSize}px`;

        // Muutused 'body' sees
        document.body.appendChild(Player);
        document.documentElement.style.cursor = 'none';

        PlayerCreated = true;
        let GameRunning = true;

    }

    // Jälgib hiire liikumist
    document.addEventListener('mousemove', function (event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Paneb mängija hiire keskele
        Player.style.left = `${mouseX - 10}px`;
        Player.style.top = `${mouseY - 10}px`;
    });
});


function createRandomCircle() {
    if (!GameRunning || !Player) return;


    const Circle = document.createElement('div');
    Circle.classList.add('Circle')

    // Pallide randomizer. Suurus, horisontaal, vertikaal. 
    const size = Math.random() * 50 + 10;
    const startPosX = Math.random() * window.innerWidth;
    const startPosY = Math.random() * window.innerHeight;

    // Random side selection for circle start position (left, right, top, bottom)
    const side = Math.floor(Math.random() * 4);  // 0: left, 1: right, 2: top, 3: bottom

    let startX, startY, endX, endY;
    let directionX = 0;
    let directionY = 0;

    // Liikumised
    if (side === 0) { // Vasakult
        startX = -size; // Algus vasakult
        startY = Math.random() * window.innerHeight;
        endX = window.innerWidth + size; // Lõpp paremal
        directionX = 1;
        directionY = Math.random() * 2 - 1; // Suvaline vertikaalne liikumine
    } 
    
    else if (side === 1) { // Paremalt
        startX = window.innerWidth + size;
        startY = Math.random() * window.innerHeight;
        endX = -size;
        directionX = -1;
        directionY = Math.random() * 2 - 1;
    } 
    
    else if (side === 2) { // Ülevalt
        startX = Math.random() * window.innerWidth;
        startY = -size; // Algus ülevalt
        endY = window.innerHeight + size; // Lõpp all
        directionX = Math.random() * 2 - 1; // Suvaline horisontaalne liikumine
        directionY = 1;
    } 
    
    else { // Altpoolt
        startX = Math.random() * window.innerWidth;
        startY = window.innerHeight + size; 
        endY = -size; 
        directionX = Math.random() * 2 - 1; 
        directionY = -1;
    }

    // .css JavaScripti sees
    Circle.style.width = `${size}px`;
    Circle.style.height = `${size}px`;
    Circle.style.left = `${startX}px`;
    Circle.style.top = `${startY}px`;
    document.body.appendChild(Circle);

    // Animatsiooni loop
    function animateCircle() {
        // Muudab positsiooni
        const currentX = parseFloat(Circle.style.left);
        const currentY = parseFloat(Circle.style.top);

        // Uuendab positsiooni
        Circle.style.left = `${currentX + directionX}px`;
        Circle.style.top = `${currentY + directionY}px`;


               // Collision detection: Check if the player collides with the circle
               const PlayerRect = Player.getBoundingClientRect();
               const CircleRect = Circle.getBoundingClientRect();
       
               const PlayerCenterX = PlayerRect.left + PlayerRect.width / 2;
               const PlayerCenterY = PlayerRect.top + PlayerRect.height / 2;
               const CircleCenterX = CircleRect.left + CircleRect.width / 2;
               const CircleCenterY = CircleRect.top + CircleRect.height / 2;
       
               const distance = Math.sqrt(
                   Math.pow(PlayerCenterX - CircleCenterX, 2) + Math.pow(PlayerCenterY - CircleCenterY, 2)
               );
       
               const PlayerRadius = PlayerSize / 2;
               const CircleRadius = size / 2;
       
               // If player collides with a smaller circle (eating it)
               if (distance < PlayerRadius + CircleRadius && size < PlayerSize) {
                   Score++;
                   PlayerSize += 1; // Increase player size
                   Player.style.width = `${PlayerSize}px`;
                   Player.style.height = `${PlayerSize}px`;
                   ScoreElement.innerText = `${Score}`;
                   Circle.remove();
               }
       
               // If player collides with a larger circle (restart)
               if (distance < PlayerRadius + CircleRadius && size > PlayerSize) {
                   gameOver(); // Restart the game
               }


        // Kas pall on jõudnud lõppu?
        if (
            (side === 0 && currentX > endX) ||
            (side === 1 && currentX < endX) ||
            (side === 2 && currentY > endY) ||
            (side === 3 && currentY < endY)
        ) {
            // Palli kustutamine
            Circle.remove();
        } else {
            // Palli edasi liigutamine
            requestAnimationFrame(animateCircle);
        }
    }

    // Animatsiooni alustamine
    animateCircle();
}

// Function to reset the game (when player hits a larger circle)
function gameOver() {
    GameRunning = false; // Stop the game
    alert("Game Over! Your final score is: " + Score);
    // Reset player size and position
    PlayerSize = 30;
    Score = 0;
    ScoreElement.innerText = `${Score}`;
    Player.style.width = `${PlayerSize}px`;
    Player.style.height = `${PlayerSize}px`;

    // Optionally, reset the player's position and other game state
    Player.style.left = `50%`;
    Player.style.top = `50%`;

    const circles = document.querySelectorAll('.Circle');
    circles.forEach(circle => circle.remove());

    // Start the game again
    setTimeout(() => {
        GameRunning = true;
    }, 1000); // Delay before restarting
}

// Funktsiooni kordumine
setInterval(createRandomCircle, 500);