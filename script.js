// ------------- НАСТРОЙКИ -------------
let settings = { tasksPerDay: 1, startHour: 9, endHour: 21 };
let completedToday = 0;
let currentTimer;
let timeLeft = 120;

const taskText = document.getElementById("task");
const getTaskBtn = document.getElementById("getTaskBtn");
const actions = document.getElementById("actions");
const timerEl = document.getElementById("timer");
const doneBtn = document.querySelector(".done");
const skipBtn = document.querySelector(".skip");

const tasksPerDayInput = document.getElementById("tasksPerDayInput");
const startHourInput = document.getElementById("startHourInput");
const endHourInput = document.getElementById("endHourInput");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const toggleSettingsBtn = document.getElementById("toggleSettingsBtn");

// Загрузка настроек
if(localStorage.getItem("settings")){
  settings = JSON.parse(localStorage.getItem("settings"));
  tasksPerDayInput.value = settings.tasksPerDay;
  startHourInput.value = settings.startHour;
  endHourInput.value = settings.endHour;
}

// Первый запуск
if(!localStorage.getItem("firstRunDone")){
  settingsPanel.classList.add("show");
  localStorage.setItem("firstRunDone","true");
}

// Кнопка ⚙️
toggleSettingsBtn.onclick = ()=>settingsPanel.classList.toggle("show");

// Сохранение настроек
saveSettingsBtn.onclick = ()=>{
  let tpd=parseInt(tasksPerDayInput.value);
  let sh=parseInt(startHourInput.value);
  let eh=parseInt(endHourInput.value);
  if(tpd<1 || sh<0 || sh>23 || eh<=sh || eh>23){
    alert("Проверьте значения!");
    return;
  }
  settings.tasksPerDay=tpd;
  settings.startHour=sh;
  settings.endHour=eh;
  localStorage.setItem("settings",JSON.stringify(settings));
  alert(`Настройки сохранены!\nЗаданий: ${tpd}\nПериод: ${sh}:00-${eh}:00`);
  settingsPanel.classList.remove("show");
};

// ------------- ЗАДАНИЯ -------------
const tasks=[
"Сделай движение рукой","Подними плечи и отпусти","Скажи себе комплимент",
"Посмотри в окно и найди что-то новое","Сделай 5 глубоких вдохов",
"Закрой глаза на 10 секунд","Поменяй руку для телефона","Посмотри на потолок и замри на 5 секунд",
"Сделай движение ногами","Положи руку на сердце","Поверни голову на 90 градусов",
"Выключи звук телефона","Скажи «стоп» перед действием","Найди новую деталь в комнате",
"Пауза перед телефоном","Одно правдивое слово рядом с кем-то","Подними подбородок на улице",
"Растяжка рук","Закрой глаза и слушай звуки","Другая поза на стуле",
// Добавь остальные до 1000
];

// Показ задания
function showTask(){
  let shown=JSON.parse(localStorage.getItem("shownTasks")||"[]");
  if(completedToday>=settings.tasksPerDay){
    taskText.innerText=`На сегодня выполнено ${completedToday}/${settings.tasksPerDay}`;
    return;
  }
  let remaining=tasks.filter(t=>!shown.includes(t));
  if(remaining.length===0){
    taskText.innerText="Все задания были! Сбросим круг.";
    localStorage.removeItem("shownTasks");
    return;
  }
  const task=remaining[Math.floor(Math.random()*remaining.length)];
  taskText.innerText=task;
  shown.push(task);
  localStorage.setItem("shownTasks",JSON.stringify(shown));
  actions.classList.remove("hidden");
  startTimer();
}

// Таймер
function startTimer(){
  clearInterval(currentTimer);
  timeLeft=120;
  updateTimer();
  currentTimer=setInterval(()=>{
    timeLeft--;
    updateTimer();
    if(timeLeft<=0) clearInterval(currentTimer);
  },1000);
}

function updateTimer(){
  const min=Math.floor(timeLeft/60);
  const sec=timeLeft%60;
  timerEl.innerText=`⏱ ${min}:${sec<10?"0":""}${sec}`;
}

// Кнопки
getTaskBtn.onclick=showTask;
doneBtn.onclick=()=>{
  clearInterval(currentTimer);
  completedToday++;
  taskText.innerText=`⚡ Засчитано! ${completedToday}/${settings.tasksPerDay} выполнено`;
  actions.classList.add("hidden");
};
skipBtn.onclick=()=>{
  clearInterval(currentTimer);
  completedToday=settings.tasksPerDay;
  taskText.innerText=`Пропущено. День закрыт (${completedToday}/${settings.tasksPerDay})`;
  actions.classList.add("hidden");
};

// Уведомления
function scheduleNotifications(){
  for(let i=0;i<settings.tasksPerDay;i++){
    const now=new Date();
    const start=new Date(); start.setHours(settings.startHour,0,0,0);
    const end=new Date(); end.setHours(settings.endHour,0,0,0);
    const randomTime=start.getTime()+Math.random()*(end.getTime()-start.getTime());
    const delay=randomTime-now.getTime();
    if(delay>0){
      setTimeout(()=>{
        if("Notification" in window && Notification.permission==="granted"){
          new Notification("⚡ Спонтанное задание",{body:"Нажми, чтобы увидеть новое задание!", icon:"icon.png"});
        } else alert("⚡ Спонтанное задание! Открой приложение");
      },delay);
    }
  }
}

if("Notification" in window){
  Notification.requestPermission().then(p=>{if(p==="granted") scheduleNotifications();});
}
