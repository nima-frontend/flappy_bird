
const game = document.getElementById('game')
const block_wrapper = document.getElementById('block-wrapper')
const blocks = document.querySelectorAll('.block')
const block_1 = document.getElementById('block1')
const block_2 = document.getElementById('block2')
const bird = document.getElementById('bird')
const score = document.getElementById('score')
const leader_board = document.getElementById('leader-board')
const leader_board_score = document.getElementById('leader-board-score')
const restart = document.getElementById('restart')
const leave = document.getElementById('leave')
const best_score = document.getElementById('best-score')
//score 
let counter = 0; 
//bird's top position
let birdTop = parseFloat(window.getComputedStyle(bird).getPropertyValue('top'));
//track jumping to prevent double jump
let  isJumping = false;
//game height to capture the bird
const gameHeight = game.offsetHeight;
let isGameOver = false;

//block's holes random position
block_wrapper.addEventListener('animationiteration',()=>{
  let random =  (Math.random()*50)
  block_wrapper.style.top = -(random) + '%'
  counter++;
  score.innerText = counter;
  updateScore();
  
})
//gravity and conditions for ending the game
const gravity = setInterval(()=>{
  birdTop+=4; 
  bird.style.top = birdTop + 'px';
  if((birdTop + bird.offsetHeight > gameHeight)||(birdTop < 0)){
    gameOver();
  }
},15)
//flapping
function jump() {
  if (isJumping || isGameOver) return;
  let jumpCount = 0;  
  isJumping = true;
  const flap = setInterval(() => {
    if (jumpCount > 15 || isGameOver) {
      clearInterval(flap);
      isJumping = false;
    } else {
      birdTop -= 9;
      bird.style.top = birdTop + 'px';
      jumpCount++;
    }
  }, 10);
}

//collision detection

const detectCollision = setInterval(()=>{
  const birdRect = bird.getBoundingClientRect();
  const block1Rect = block_1.getBoundingClientRect();
  const block2React = block_2.getBoundingClientRect();

  if(
    birdRect.right >block1Rect.left &&
    birdRect.left < block1Rect.right &&
    (birdRect.top < block1Rect.bottom || birdRect.bottom > block2React.top)
  ){
    gameOver()
  }

},10)


// Controls 
window.addEventListener('keydown',(e)=>{
  if(e.code === 'Space' || 'Enter'){
    jump()
  }
})
window.addEventListener('touchstart',jump)
window.addEventListener('click',jump)
restart.addEventListener('click',()=>window.location.href = '/index.html')
leave.addEventListener('click',()=> window.close())
 

//game over function 
function gameOver(){ 
  block_wrapper.style.animation = 'none'
  leader_board_score.innerText  = counter  
  leader_board.style.display = 'block'
  isGameOver = true;   
  cleanUp()
  let savedBest = parseInt(getCookie("bestScore")||0)
  if(counter > savedBest){
    setCookie("bestScore",counter,365);
    best_score.innerText = counter 
  }else{
    best_score.innerText = savedBest
  }
}
//clean up 
function cleanUp(){
  clearInterval(gravity);
  clearInterval(detectCollision);
  window.removeEventListener('click', jump);
  window.removeEventListener('touchstart', jump);
}

function updateScore(){
   if(counter >= 10 && counter <= 19){
  score.style.color = 'silver'
  }else if(counter >=20 && counter <=29){
  score.style.color = 'goldenrod';
  }else if(counter >= 30){
  score.style.color = 'purple'
  }else{
    score.style.color = 'white'
  }
}



// set best score

function setCookie(name,value,days){
  const date = new Date();
  date.setTime(date.getTime() + (days*24*60*60*1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function getCookie(name){
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for(let c of cookies){
    while (c.charAt(0) ==' ') c = c.substring(1);
    if(c.indexOf(name + "=") == 0){
      return c.substring((name + "=").length, c.length)
    }
  }
  return null;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.log('Service Worker registration failed', err));
}
