//board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;

//bird
let birdwidth = 34;
let birdheight = 24;
let birdx = boardwidth / 8;
let birdy = boardheight / 2;// to place the bird in a partcular position with regards to the height and width of canvas board
let birdimg;


let bird = {//bird object
    x: birdx,
    y: birdy,
    width: birdwidth,
    height: birdheight
}
//pipes
let pipeArray = [];
let pipewidth = 64;//width/height ratio=384/3072
let pipeheight = 512;
let pipex = boardwidth;
let pipey = 0;

let toppipeimg;
let bottompipeimg;

//game physics
let velocityx = -2//pipe moving left
let velocityy = 0; //bird jump speed
let gravity = 0.3;
let gameover = false;
let score = 0;
let countdown=3;
let gameStarted=false;



window.onload = function () {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");//draawing on the board

    // //draw the bird
    // context.fillStyle="green";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load image
    birdimg = new Image();
    birdimg.src = "flappybird2.png";
    birdimg.onload = function () {
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    }
    toppipeimg = new Image();
    toppipeimg.src = "./toppipe.png";

    bottompipeimg = new Image()
    bottompipeimg.src = "./bottompipe.png";

startCountdown();
    requestAnimationFrame(update);
    // setInterval(placepipes, 1500);
    document.addEventListener("keydown", movebird);

}

function startCountdown(){
    let interval=setInterval(()=>{
        countdown--;
        if (countdown<= 0){
            clearInterval(interval);
            gameStarted=true;
            pipeArray=[];
          setInterval(placepipes,1500);
        }
    },1000);
}
function update() {//update the frames of canvas
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);//clear previous canvas frame
    if (!gameStarted) {
        context.fillStyle = "black";
        context.font = "40px Arial";
        context.fillText(countdown > 0 ? countdown : "GO!", board.width / 2 - 30, board.height / 2);
     
        return;
    } 
   
    if(gameover){
        context.fillText("GAME OVER", 50, 310);
        return;
    }    
   
    
    //bird  again and again for each frame
    velocityy += gravity;
    bird.y = Math.max(bird.y + velocityy + 0);//apply gravity properly
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameover = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityx;//shifting pipe 2pixels left
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;//because of 2 pipe so that score becomes one
            pipe.passed = true;
        }

        if (detectcollision(bird, pipe)) {
            gameover = true;
        }
    
    }
    //scores

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    // if (gameover) {
    //     context.fillText("GAME OVER", 50, 310);
    // }

}

function placepipes() {
    if (gameover) {
        return;
    }
    //(0 to 1 values for math.random)*pipeheight/2,
    //0->-128 (as value for 0)
    //1->-128-256(pipeheight/4-pipeheight/2)=3/4 of pipeheight
    let randompipey = pipey - pipeheight / 4 - Math.random() * (pipeheight / 2);

    let openingspace = board.height / 4;
    let toppipe = {
        img: toppipeimg,
        x: pipex,
        y: randompipey,
        width: pipewidth,
        height: pipeheight,
        passed: false
    }
    // pipeArray.push(toppipe);

    let bottompipe = {
        img: bottompipeimg,
        x: pipex,
        y: randompipey + pipeheight + openingspace,
        width: pipewidth,
        height: pipeheight,
        passed: false

    }
    pipeArray.push(toppipe, bottompipe);
}
function movebird(e) {
    if(!gameStarted){
        return;
    }
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "keyX") {
        //bird made to jump
        velocityy = -6;   

        if (gameover) {
            setTimeout(() => {
                bird.y = birdy;
                pipeArray = [];
                score = 0;
                gameover = false;
                countdown=3;
                gameStarted=false;
                startCountdown();

            }, 1000)

        }
    }

}

function detectcollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}