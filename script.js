let username="";
let i=0, money=0, safeMoney=0;
let timer, timeLeft=30;

const levels=[5000,10000,15000,20000,25000];
const checkpoints={4:25000};

const questions=[
{q:"Largest planet?",op:["Mars","Jupiter","Earth","Saturn"],ans:1},
{q:"Pink city?",op:["Jaipur","Udaipur","Jodhpur","Bikaner"],ans:0},
{q:"Seconds in hour?",op:["60","360","3600","36000"],ans:2},
{q:"Symbol Au?",op:["Silver","Gold","Copper","Iron"],ans:1},
{q:"National bird?",op:["Peacock","Crow","Parrot","Eagle"],ans:0}
];

// START
function startGame(){
  username=document.getElementById("username").value;
  if(username===""){ alert("Enter name"); return; }

  document.getElementById("login").style.display="none";
  document.getElementById("game").style.display="block";

  loadQ();
}

// LOAD
function loadQ(){
  if(i>=questions.length){
    winGame();
    return;
  }

  let q=questions[i];
  document.getElementById("question").innerText=q.q;

  for(let j=0;j<4;j++){
    let b=document.getElementById("btn"+j);
    b.innerText=q.op[j];
    b.disabled=false;
    b.className="";
  }

  startTimer();
}

// TIMER
function startTimer(){
  clearInterval(timer);
  timeLeft=30;

  timer=setInterval(()=>{
    timeLeft--;
    document.getElementById("timer").innerText="⏳ "+timeLeft;

    if(timeLeft<=0){
      clearInterval(timer);
      disableOptions();
      gameOver("Time Up ₹ "+safeMoney);
    }
  },1000);
}

// DISABLE
function disableOptions(){
  for(let j=0;j<4;j++){
    document.getElementById("btn"+j).disabled=true;
  }
}

// CHECK
function check(ans){
  clearInterval(timer);
  disableOptions();

  let correct=questions[i].ans;

  if(ans===correct){
    document.getElementById("btn"+ans).className="correct";

    money=levels[i];
    if(checkpoints[i]) safeMoney=checkpoints[i];

    document.getElementById("money").innerText="₹ "+money;

    i++;
    setTimeout(loadQ,1000);

  } else {
    document.getElementById("btn"+ans).className="wrong";
    gameOver("Wrong! Take Home ₹ "+safeMoney);
  }
}

// GAME OVER
function gameOver(msg){
  document.getElementById("question").innerText=msg;
  document.getElementById("restartBtn").style.display="block";

  saveScore(safeMoney);
  showLeaderboard();
}

// WIN
function winGame(){
  document.getElementById("game").style.display="none";
  document.getElementById("winScreen").style.display="flex";

  document.getElementById("finalMoney").innerText="₹ "+money;

  saveScore(money);
  showLeaderboard();
}

// RESTART
function restartGame(){
  i=0; money=0; safeMoney=0;

  document.getElementById("winScreen").style.display="none";
  document.getElementById("game").style.display="block";
  document.getElementById("restartBtn").style.display="none";

  document.getElementById("money").innerText="₹ 0";

  loadQ();
}

// SAVE (LOCAL STORAGE)
function saveScore(score){
  let scores=JSON.parse(localStorage.getItem("kbcScores")) || [];

  scores.push({name:username,score:score});

  scores.sort((a,b)=>b.score-a.score);

  localStorage.setItem("kbcScores",JSON.stringify(scores.slice(0,5)));
}

// SHOW LEADERBOARD
function showLeaderboard(){
  let scores=JSON.parse(localStorage.getItem("kbcScores")) || [];
  let list=document.getElementById("scores");

  list.innerHTML="";

  scores.forEach(s=>{
    let li=document.createElement("li");
    li.innerText=s.name+" - ₹ "+s.score;
    list.appendChild(li);
  });
}

// QUIT
function quitGame(){
  clearInterval(timer);
  disableOptions();
  gameOver("Quit ₹ "+money);
}
