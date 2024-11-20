let PlayerCreated;
let Player;
let PlayerSize = 20;
let Score = 0;
let GameRunning = false;

const Fullscreen = document.getElementsByClassName('fullscreen');
const StartingScreen = document.getElementById('startingScreen');


// Funktsioonid


function EnterFullscreen() {
    const body = document.body;
    if (body.requestFullscreen) { body.requestFullscreen() } 
    else if (body.webkitRequestFullscreen) { body.webkitRequestFullscreen() }
}

function startGame() {
    // Create player
    if (!PlayerCreated) {
        let Player = document.createElement('div');
        Player.classList.add('Player');
        Player.style.width = `${PlayerSize}px`;
        Player.style.height = `${PlayerSize}px`;

        // Add the player to the body
        document.body.appendChild(Player);
        document.documentElement.style.cursor = 'none'; // Hide the cursor
        PlayerCreated = true;
        let ScoreElement = document.createElement('h1')
        ScoreElement.classList.ass('ScoreElement')
    }

    // Hide starting screen and fullscreen button
    StartingScreen.style.display = 'none';
    Fullscreen.style.display = 'none'; // Hide fullscreen button

    // Start creating random circles
    setInterval(createRandomCircle, 500);

    // Start the game
    GameRunning = true;
}


// Function to handle game over
function gameOver() {
    GameRunning = false;   
    
    const circles = document.querySelectorAll('.Circle');
    circles.forEach(circle => circle.remove());

    Player.remove();

    // Reset player size and position
    Score = 0;
    ScoreElement.innerText = `${Score}`;
    Player.style.width = `${PlayerSize}px`;
    Player.style.height = `${PlayerSize}px`;

    // Reset the player's position and other game state
    Player.style.left = `50%`;
    Player.style.top = `50%`;

    // Remove all circles


    Fullscreen.style.display = 'block';
    StartingScreen.style.display = 'block';
}

document.addEventListener('keydown', function(event) {
    // Check if the pressed key is the spacebar (key code "Space")
    if (event.code === 'Space' && !GameRunning) {
        startGame();  // Call startGame function

        // Hide the cursor
        document.body.style.cursor = 'none';
    }
});



function CreateRandomCircles () {
    if (!GameRunning || !Player) return;

    // Loob palli
    const Circle = document.createElement('div');
    Circle.classList.add('Circle');

    // Palli suurus olevenalt mängija suurusest ± 5px
    const size = Math.random() * (PlayerSize + 10) + (PlayerSize - 5);
    const startPosX = Math.random() * window.innerWidth;
    const startPosY = Math.random() * window.innerHeight;

    // Palli trajektoor
    const side = Math.floor(Math.random() * 4);
    let startX, startY, endX, endY;
    let directionX = 0;
    let directionY = 0;

        if (side === 0) { // Vasakult
            startX = -size;
            startY = Math.random() * window.innerHeight;
            endX = window.innerWidth + size;
            directionX = 1;
            directionY = Math.random() * 2 - 1;
        } else if (side === 1) { // Paremalt
            startX = window.innerWidth + size;
            startY = Math.random() * window.innerHeight;
            endX = -size;
            directionX = -1;
            directionY = Math.random() * 2 - 1;
        } else if (side === 2) { // Ülevalt
            startX = Math.random() * window.innerWidth;
            startY = -size;
            endY = window.innerHeight + size;
            directionX = Math.random() * 2 - 1;
            directionY = 1;
        } else { // Alt
            startX = Math.random() * window.innerWidth;
            startY = window.innerHeight + size;
            endY = -size;
            directionX = Math.random() * 2 - 1;
            directionY = -1;
        }

    // .css JavaScripti siseselt
    Circle.style.width = `${size}px`;
    Circle.style.height = `${size}px`;
    Circle.style.left = `${startX}px`;
    Circle.style.top = `${startY}px`;
    document.body.appendChild(Circle);

    // Animatsiooni funktsioon
    function AnimateCircle() {
        const currentX = parseFloat(Circle.style.left);
        const currentY = parseFloat(Circle.style.top);
        Circle.style.left = `${currentX + directionX}px`;
        Circle.style.top = `${currentY + directionY}px`;

        CollisionCheck(Circle, size);

        // Kustutab palli, kui ta jõuab lõppu
        if (
            (side === 0 && currentX > endX) ||
            (side === 1 && currentX < endX) ||
            (side === 2 && currentY > endY) ||
            (side === 3 && currentY < endY)
        ) {
            Circle.remove();
        } else {
            requestAnimationFrame(AnimateCircle);
        }
    }
       
    // Paneb animatsiooni funktsiooni tööle
    AnimateCircle();
}

function CollisionCheck(Circle, size) {
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
        PlayerSize += 1;  // Increase player size
        Player.style.width = `${PlayerSize}px`;
        Player.style.height = `${PlayerSize}px`;
        ScoreElement.innerText = `${Score}`;
        Circle.remove();
    }

    // If player collides with a larger circle (game over)
    if (distance < PlayerRadius + CircleRadius && size > PlayerSize) {
        gameOver();  // Trigger game over
    }
}


// EventListenerid


document.addEventListener('mousemove', function (event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    Player.style.left = `${mouseX - 10}px`;
    Player.style.top = `${mouseY - 10}px`;
});


Fullscreen.addEventListener('click', function () {
    EnterFullscreen();
});
