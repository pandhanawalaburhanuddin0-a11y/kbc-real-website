let lang="EN";
let i=0, money=0, safeMoney=0;
let timer, timeLeft=30;
let musicOn=false;

const checkpoints={4:25000,9:500000,15:70000000};
const levels=[5000,10000,15000,20000,25000,50000,100000,200000,300000,500000,750000,1250000,2500000,5000000,10000000,70000000];

// 🔥 BIG QUESTION BANK (you can add more)
const questions=[
{en:"Largest planet?",hi:"सबसे बड़ा ग्रह?",op:["Mars","Jupiter","Earth","Saturn"],hiop:["मंगल","बृहस्पति","पृथ्वी","शनि"],ans:1},
{en:"Pink city?",hi:"गुलाबी शहर?",op:["Jaipur","Udaipur","Jodhpur","Bikaner"],hiop:["जयपुर","उदयपुर","जोधपुर","बीकानेर"],ans:0},
{en:"Seconds in hour?",hi:"घंटे में सेकंड?",op:["60","360","3600","36000"],hiop:["60","360","3600","36000"],ans:2},
{en:"Symbol Au?",hi:"Au किसका प्रतीक?",op:["Silver","Gold","Copper","Iron"],hiop:["चांदी","सोना","तांबा","लोहा"],ans:1},
{en:"National bird?",hi:"राष्ट्रीय पक्षी?",op:["Peacock","Crow","Parrot","Eagle"],hiop:["मोर","कौवा","तोता","गरुड़"],ans:0},
];

// 🎲 RANDOM
function getRandomQuestions(){
  return questions.sort(()=>0.5-Math.random()).slice(0,16);
}
let selectedQuestions=[];

// 🎤 VOICE
function speak(text){
  let msg=new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}

// 🔊 SOUND
function play(id){ document.getElementById(id).play(); }

// 🎵 MUSIC
function toggleMusic(){
  let m=document.getElementById("bgMusic");
  musicOn?m.pause():m.play();
  musicOn=!musicOn;
}

// START
function startGame(){
  document.getElementById("intro").style.display="none";
  document.getElementById("game").style.display="block";
  selectedQuestions=getRandomQuestions();
  speak("Welcome to KBC");
  loadQ();
}

// TIMER
function startTimer(){
  clearInterval(timer);
  timeLeft=30;
  timer=setInterval(()=>{
    timeLeft--;
    document.getElementById("timer").innerText="⏳ "+timeLeft;
    if(timeLeft<=5){ document.getElementById("tickSound").play(); }
    if(timeLeft<=0){ clearInterval(timer); gameOver("Time Up"); }
  },1000);
}

// LOAD
function loadQ(){
  if(i>=selectedQuestions.length){ gameOver("You Won!"); return; }

  let q=selectedQuestions[i];
  let text=lang==="EN"?q.en:q.hi;
  let ops=lang==="EN"?q.op:q.hiop;

  document.getElementById("question").innerHTML=text+"<br>₹ "+levels[i];

  for(let j=0;j<4;j++){
    let b=document.getElementById("btn"+j);
    b.innerText=ops[j];
    b.disabled=false;
    b.className="";
    b.style.display="block";
  }

  startTimer();
}

// CHECK
function check(ans){
  play("clickSound");
  clearInterval(timer);

  let correct=selectedQuestions[i].ans;

  document.getElementById("suspense").play();

  setTimeout(()=>{
    if(ans===correct){
      play("correctSound");
      document.getElementById("btn"+ans).className="correct";
      money=levels[i];
      if(checkpoints[i]) safeMoney=checkpoints[i];
      document.getElementById("money").innerText="₹ "+money;
      i++;
      setTimeout(loadQ,1500);
    } else {
      play("wrongSound");
      document.getElementById("btn"+ans).className="wrong";
      gameOver("Wrong! ₹ "+safeMoney);
    }
  },2000);
}

// OTHER
function quitGame(){ gameOver("Quit ₹ "+money); }
function toggleLang(){ lang=(lang==="EN")?"HI":"EN"; loadQ(); }

function lifeline5050(){
  let c=selectedQuestions[i].ans, r=0;
  for(let j=0;j<4;j++){
    if(j!==c && r<2){
      document.getElementById("btn"+j).style.display="none"; r++;
    }
  }
}

function audiencePoll(){
  document.getElementById("result").innerText="Audience: "+(selectedQuestions[i].ans+1);
}

function phoneFriend(){
  document.getElementById("result").innerText="Friend: "+(selectedQuestions[i].ans+1);
}

function gameOver(msg){
  document.getElementById("question").innerHTML=msg;
}