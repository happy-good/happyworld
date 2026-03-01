const STORAGE_KEY="checklistData";

const todayTitle=document.getElementById("todayTitle");
const screen1=document.getElementById("screen1");
const screen2=document.getElementById("screen2");
const screen3=document.getElementById("screen3");

const countInput=document.getElementById("countInput");
const goToScreen2=document.getElementById("goToScreen2");
const completeBtn=document.getElementById("completeBtn");
const backTo1=document.getElementById("backTo1");
const backTo2=document.getElementById("backTo2");

// 모달 요소 추가
const passwordModal = document.getElementById("passwordModal");
const passwordInput = document.getElementById("passwordInput");
const cancelPassword = document.getElementById("cancelPassword");
const confirmPassword = document.getElementById("confirmPassword");

/* 날짜 */
function getTodayKey(){
  return new Date().toISOString().split("T")[0];
}

function getDisplayDate(){
  const d=new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
}

/* 저장 */
function loadData(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveData(data){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
}

function resetIfDateChanged(){
  const saved=loadData();
  const today=getTodayKey();
  if(!saved || saved.date!==today){
    localStorage.removeItem(STORAGE_KEY);
    return {date:today,count:0,inputs:[],tasks:[]};
  }
  return saved;
}

/* 화면 전환 */
function showScreen(num){
  screen1.classList.add("hidden");
  screen2.classList.add("hidden");
  screen3.classList.add("hidden");
  completeBtn.classList.add("hidden");
  backTo1.classList.add("hidden");
  backTo2.classList.add("hidden");

  if(num===1) screen1.classList.remove("hidden");

  if(num===2){
    screen2.classList.remove("hidden");
    completeBtn.classList.remove("hidden");
    backTo1.classList.remove("hidden");
  }

  if(num===3){
    screen3.classList.remove("hidden");
    backTo2.classList.remove("hidden");
  }
}

/* 입력창 생성 */
function createInputs(count, values=[]){
  screen2.innerHTML="";
  const inputs = [];
  for(let i=0;i<count;i++){
    const input=document.createElement("input");
    input.type="text";
    input.placeholder=`항목 ${i+1}`;
    input.value=values[i] || "";

    input.addEventListener("input",()=>{
      const data=resetIfDateChanged();
      data.inputs[i]=input.value;
      saveData(data);
    });
    
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const nextInput = inputs[i + 1];
        if (nextInput) {
          nextInput.focus();
        } else {
          completeBtn.focus();
        }
      }
    });

    screen2.appendChild(input);
    inputs.push(input);
  }
  if(inputs.length > 0) {
      inputs[0].focus();
  }
}

/* 1 -> 2 */
goToScreen2.addEventListener("click",()=>{
  const count=parseInt(countInput.value);
  if(!count || count<1) return;

  let data=resetIfDateChanged();
  data.count=count;
  // 목록 개수가 변경되면, 입력값 배열도 길이에 맞게 초기화합니다.
  if (data.inputs.length !== count) {
      data.inputs = new Array(count).fill("");
  }
  saveData(data);

  createInputs(count,data.inputs);
  showScreen(2);
});

countInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // 기본 엔터 동작(예: 폼 제출) 방지
    goToScreen2.click(); // '다음' 버튼을 프로그래매틱하게 클릭
  }
});

/* 2 -> 3 */
completeBtn.addEventListener("click",()=>{
  let data=resetIfDateChanged();

  // 기존 task의 완료 상태를 text 기준으로 저장합니다.
  const oldTasksStatus = {};
  data.tasks.forEach(task => {
      oldTasksStatus[task.text] = task.done;
  });

  const inputs=screen2.querySelectorAll("input");
  data.tasks=[];
  data.inputs=[];

  inputs.forEach(input=>{
    data.inputs.push(input.value);
    const text = input.value.trim();
    if(text!==""){
        // 기존에 있던 항목이면 완료 상태를 유지하고, 새로운 항목이면 false로 설정합니다.
        const isDone = oldTasksStatus[text] || false;
        data.tasks.push({text: text, done: isDone});
    }
  });

  saveData(data);
  renderButtons(data);
});

/* 버튼 화면 */
function renderButtons(data) {
  screen3.innerHTML = "";
  data.tasks.forEach((task, index) => {
    const btn = document.createElement("button");
    btn.className = "task-btn";

    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;
    btn.appendChild(textSpan);

    if (task.done) {
      btn.classList.add("done");

      const statusContainer = document.createElement("div");
      statusContainer.className = "status-container";

      const doneText = document.createElement("span");
      doneText.textContent = "완료";
      doneText.className = "done-text";

      const cancelDoneBtn = document.createElement("button");
      cancelDoneBtn.textContent = "취소";
      cancelDoneBtn.className = "cancel-done-btn";

      cancelDoneBtn.addEventListener("click", (event) => {
        event.stopPropagation(); // 메인 버튼의 클릭 이벤트 전파를 막습니다.
        task.done = false;
        saveData(data);
        renderButtons(data);
      });

      statusContainer.appendChild(doneText);
      statusContainer.appendChild(cancelDoneBtn);
      btn.appendChild(statusContainer);
    } else {
      // 완료되지 않은 항목에만 완료 처리 클릭 이벤트를 추가합니다.
      btn.addEventListener("click", () => {
        task.done = true;
        saveData(data);
        renderButtons(data);
      });
    }

    screen3.appendChild(btn);
  });

  showScreen(3);
}


/* 뒤로가기 */
backTo1.addEventListener("click",()=>{
  showScreen(1);
});

// backTo2 버튼: 모달 띄우기
backTo2.addEventListener("click", () => {
  passwordModal.classList.add("is-visible"); // is-visible 클래스 추가
  passwordInput.value = ""; // 입력창 초기화
  passwordInput.focus(); // 입력창에 포커스
});

// 모달 닫기 (취소 버튼)
cancelPassword.addEventListener("click", () => {
  passwordModal.classList.remove("is-visible"); // is-visible 클래스 제거
});

// 모달 외부 클릭 시 닫기
passwordModal.addEventListener("click", (event) => {
  if (event.target === passwordModal) {
    passwordModal.classList.remove("is-visible"); // is-visible 클래스 제거
  }
});

// 비밀번호 확인 로직
confirmPassword.addEventListener("click", () => {
  const password = passwordInput.value;
  if (password === "0000") {
    passwordModal.classList.remove("is-visible"); // is-visible 클래스 제거
    const data = resetIfDateChanged();
    createInputs(data.count, data.inputs);
    showScreen(2);
  } else {
    // 간단한 흔들기 애니메이션 효과
    passwordModal.querySelector(".modal-content").animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' },
    ], {
      duration: 500,
      easing: 'ease-in-out'
    });
    passwordInput.value = ""; // 입력창 비우기
    passwordInput.focus();
  }
});

// 비밀번호 입력창에서 Enter 키 누를 때 확인 버튼 클릭
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    confirmPassword.click();
  }
});

/* 초기 실행 */
function initialize(){
  todayTitle.innerText=getDisplayDate();
  const data=resetIfDateChanged();

  if(data.tasks.length>0){
    renderButtons(data);
  }else if(data.count>0){
    countInput.value=data.count;
    createInputs(data.count,data.inputs);
    showScreen(2);
  }
}

initialize();
