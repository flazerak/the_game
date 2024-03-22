let levelgameset = false;
let levelgame;
// select canvas element
const canvas = document.getElementById("pong");
let start = false;

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

let isTwoPlayer = false;

let ball ;
let speedMultiplier = 1;
        
let score = 0;

// User Paddle
const user = {
    x : 0, 
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// COM Paddle
const com = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

function showLevelButtons() {
    const existingLevelButtons = document.getElementById("levelButtons");
    if (existingLevelButtons) {
        existingLevelButtons.remove();
    }

    const levelButtonsContainer = document.createElement("div");
levelButtonsContainer.id = "levelButtonsContainer";
document.body.appendChild(levelButtonsContainer);

// Style the container
const canvasRect = canvas.getBoundingClientRect();
levelButtonsContainer.style.position = "absolute";
levelButtonsContainer.style.top = `${canvasRect.top + (canvas.height / 4)}px`;
levelButtonsContainer.style.left = "50%";
levelButtonsContainer.style.transform = "translateX(-50%)"; // Center the container horizontally
levelButtonsContainer.style.display = "flex";
levelButtonsContainer.style.flexDirection = "column"; // Stack buttons vertically
levelButtonsContainer.style.alignItems = "center"; // Center buttons horizontally within the container
levelButtonsContainer.style.gap = "10px"; // Space between buttons

// Define levels and create buttons for each level
const levels = ["Easy", "Medium", "Hard"];
levels.forEach(level => {
    const levelButton = document.createElement("button");
    levelButton.textContent = level;
    
    // Apply styles to each button
    levelButton.style.padding = "10px 20px";
    levelButton.style.fontSize = "25px";
    levelButton.style.margin = "5px";
    levelButton.style.background = "#f0f0f0";
    levelButton.style.border = "2px solid #d3d3d3";
    levelButton.style.color = "white";
    levelButton.style.backgroundColor = "black";
    levelButton.style.width = "200px"; 
    levelButton.style.borderRadius = "6px";
    

    levelButton.addEventListener("click", function() {
                levelgame = level;
                levelgameset = true;
                levelButtonsContainer.style.display = "none"; // Hide level buttons
                showStartButton(); // Show start button
                initializeBall();

            });   

    // Add each button to the container
    levelButtonsContainer.appendChild(levelButton);
});
}


function initializeBall(){
    
    if (levelgame == "Medium")
        speedMultiplier = 1.4;
    else if (levelgame == "Hard")
        speedMultiplier = 1.7;


    ball= {
        x : canvas.width/2,
        y : canvas.height/2,
        radius : 10,
        velocityX : 5 * speedMultiplier,
        velocityY : 5 * speedMultiplier,
        speed : 5 * speedMultiplier,
        color : "WHITE"
    }
}


function showStartButton() {
    let startButton = document.getElementById("startButton");
    if (!startButton) {
        startButton = document.createElement("button");
        startButton.id = "startButton";
        startButton.textContent = "Start";
        document.body.appendChild(startButton);

        // Position the start button similarly
        const canvasRect = canvas.getBoundingClientRect();
        startButton.style.position = "absolute";
        startButton.style.left = `${canvasRect.left + (canvas.width / 2) - startButton.offsetWidth / 2}px`;
        startButton.style.top = `${canvasRect.top + (canvas.height / 1.25) - startButton.offsetHeight / 2}px`;
        startButton.style.display = "block";
    }

    startButton.onclick = () => {
        start = true;
        startButton.style.display = "none"; // Hide the start button once the game starts
        game();
    };
}



document.body.addEventListener('keydown', handleKeydown);

function handleKeydown(ev){
    if (start == true)
    {
        if (ev.key == "ArrowDown" && (user.y + user.height) < canvas.height)
            user.y += ball.speed * 3;

        if (ev.key == "ArrowUp" && user.y > 0)
            user.y -= ball.speed * 3;
        //handle com
        if((ev.key == "w" || ev.key == 'W') && com.y > 0 && isTwoPlayer)
            com.y -= ball.speed * 3;
        if((ev.key == "s" || ev.key == 'S') &&((com.y + com.height) < canvas.height) && isTwoPlayer)
            com.y += ball.speed * 3;
    }
    
}



// when COM or USER scores, we reset the ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    // ball.speed = 7;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px 'Arial', sans-serif";
    ctx.fillText(text, x, y);
}

// collision detection
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function resetGame(){
    user.score = 0;
    com.score = 0;
    resetBall();
    restPadlles();

}

function  restPadlles(){
    user.x = 0;
    user.y = (canvas.height - 100)/2;
    com.x = canvas.width - 10;
    com.y = (canvas.height - 100)/2;

   
}

document.getElementById('vsComputer').addEventListener('click', function() {
    isTwoPlayer = false;
    document.getElementById('gameMode').style.display = 'none';
    render();
    showLevelButtons();
});

document.getElementById('twoPlayers').addEventListener('click', function() {
    isTwoPlayer = true;
    document.getElementById('gameMode').style.display = 'none';
    render();
    showLevelButtons();
});



function update(){
    if(start == true)
    {
        if( ball.x - ball.radius < 0 ){
            com.score++;
            resetBall();
        }else if( ball.x + ball.radius > canvas.width){
            user.score++;
            resetBall();
        }
        
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
    
    // computer plays for itself, and we must be able to beat it
    // simple AI
        if (!isTwoPlayer )
            com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    // when the ball collides with bottom and top walls we inverse the y velocity.
        if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
            ball.velocityY = -ball.velocityY;
    }
    
    //  check if the paddle hit the user or the com paddle
        let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    // if the ball hits a paddle
        if(collision(ball,player)){
            //  check where the ball hits the paddle
            let collidePoint = (ball.y - (player.y + player.height/2));
            // normalize the value of collidePoint, we need to get numbers between -1 and 1.
            // -player.height/2 < collide Point < player.height/2
            collidePoint = collidePoint / (player.height/2);
            
            // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
            // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
            // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
            // Math.PI/4 = 45degrees
            let angleRad = (Math.PI/4) * collidePoint;
            
            // change the X and Y velocity direction
            let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);
            
            // speed up the ball everytime a paddle hits it.
            ball.speed += 0.1;
        }
    }
}

// render function, the function that does al the drawing
function render(){
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    if (levelgameset === true)
    {
        drawText(user.score, canvas.width/4,canvas.height/5);
        
        drawText(com.score, 3*canvas.width/4,canvas.height/5);
        
        drawNet();
        
        // draw the user's paddle
        drawRect(user.x, user.y, user.width, user.height, user.color);
        
        // draw the COM's paddle
        drawRect(com.x, com.y, com.width, com.height, com.color);
        
        drawArc(ball.x, ball.y, ball.radius, ball.color);
    }
}
function game(){
    update();
    render();
}
// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);

