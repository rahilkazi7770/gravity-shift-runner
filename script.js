const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 500;

let gravity = 0.6;
let gravityDirection = 1; // 1 = normal, -1 = flipped

let gameOver = false;
let score = 0;

let player = {
    x: 100,
    y: 400,
    width: 40,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    jumping: false
};

let keys = {};

let coins = [
    { x: 300, y: 420, collected: false },
    { x: 600, y: 100, collected: false }
];

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;

    if (e.code === "KeyG") {
        gravityDirection *= -1; // flip gravity
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawGround() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 460, canvas.width, 40);
    ctx.fillRect(0, 0, canvas.width, 40);
}

function drawCoins() {
    ctx.fillStyle = "gold";
    coins.forEach(coin => {
        if (!coin.collected) {
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function checkCoinCollision() {
    coins.forEach(coin => {
        if (!coin.collected &&
            player.x < coin.x + 10 &&
            player.x + player.width > coin.x - 10 &&
            player.y < coin.y + 10 &&
            player.y + player.height > coin.y - 10) {

            coin.collected = true;
            score += 100;
        }
    });
}

function update() {

    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", 350, 250);
        ctx.font = "20px Arial";
        ctx.fillText("Refresh to Restart", 370, 300);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Movement
    if (keys["ArrowLeft"]) {
        player.velocityX = -5;
    } else if (keys["ArrowRight"]) {
        player.velocityX = 5;
    } else {
        player.velocityX = 0;
    }

    player.x += player.velocityX;

    // Jump
    if (keys["Space"] && !player.jumping) {
        player.velocityY = -12 * gravityDirection;
        player.jumping = true;
    }

    // Gravity
    player.velocityY += gravity * gravityDirection;
    player.y += player.velocityY;

    // Ground collision
    if (gravityDirection === 1 && player.y + player.height > 460) {
        player.y = 460 - player.height;
        player.velocityY = 0;
        player.jumping = false;
    }

    if (gravityDirection === -1 && player.y < 40) {
        player.y = 40;
        player.velocityY = 0;
        player.jumping = false;
    }

    // Fall off screen
    if (player.y > canvas.height || player.y < -50) {
        gameOver = true;
    }

    drawGround();
    drawPlayer();
    drawCoins();
    checkCoinCollision();

    score++;
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    requestAnimationFrame(update);
}

update();