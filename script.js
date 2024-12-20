let PlayerCreated = false;
let PlayerSize = 20;
let Player;
let ScoreElement;
let Score = 0;
let GameRunning = false;
let GameOver = false;
const Fullscreen = document.getElementById('Fullscreen');


// Funktsioonid


function EnterFullscreen() {
    const body = document.body;
    if (body.requestFullscreen) { body.requestFullscreen(); }
    else if (body.webkitRequestFullscreen) { body.webkitRequestFullscreen(); }
}

function StartGame() {
    if (!PlayerCreated) {
        // Create the Player element and use the global Player variable
        Player = document.createElement('div');
        document.body.appendChild(Player);
        Player.classList.add('Player');
        Player.style.width = `${PlayerSize}px`;
        Player.style.height = `${PlayerSize}px`;
        
        // Hide the cursor
        document.documentElement.style.cursor = 'none';
        
        // Mark Player as created
        PlayerCreated = true;

        // Create and display the score element
        ScoreElement = document.createElement('h1');
        ScoreElement.classList.add('ScoreElement');
        document.body.appendChild(ScoreElement);
        ScoreElement.innerText = "0";  // Initialize score

        StartingScreen.style.display = 'none'
        EndingScreen.style.display = 'none'

        setInterval(CreateRandomCircle, 500);

        GameRunning = true
    }
}

function gameOver() {
    GameRunning = false; 
    GameOver = true;  
    
    const circles = document.querySelectorAll('.Circle');
    circles.forEach(circle => circle.remove());

    Player.remove();
    
    document.getElementById('EndingScreen').style.display = 'block';

    const endingText = document.getElementById('EndingText');
    endingText.innerText = `Sinu tulemus oli ${Score}`;

    Score = 0;
    Player.style.width = `${PlayerSize}px`;
    Player.style.height = `${PlayerSize}px`;

    Player.style.left = `50%`;
    Player.style.top = `50%`;

    Fullscreen.style.display = 'block';
    ScoreElement.style.display = 'none';
}

function CreateRandomCircle () {
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


// Eventide kuulajad


Fullscreen.addEventListener('click', function () {
    EnterFullscreen();
    Fullscreen.style.display = 'none';
});

document.addEventListener('mousemove', function (event) {
    if (Player) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Move the player based on mouse position, adjusted for its size
        Player.style.left = `${mouseX - PlayerSize / 2}px`;
        Player.style.top = `${mouseY - PlayerSize / 2}px`;
    }
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (!GameRunning || GameOver) {
            StartGame();        // Start the game if it's not running or game is over
            GameRunning = true; // Set the game as running
            GameOver = false; // Reset the game over flag
        }
        
        // Hide the cursor whether the game is starting or already running
        document.body.style.cursor = 'none';  
    }
});

