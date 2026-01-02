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
const tasks = [
  "Скажи себе комплимент вслух",
  "Подними руки и замри на 5 секунд",
  "Сделай глубокий вдох и громко выдохни",
  "Посмотри в зеркало и улыбнись странно",
  "Подойди к окну и крикни 'Привет миру!' тихо",
  "Скажи случайному человеку 'Спасибо, что ты здесь'",
  "Поставь таймер на 1 минуту и просто молчи",
  "Напиши в заметках то, что стесняешься признать",
  "Отправь себе сообщение с фразой 'Ты странный, но классный'",
  "Попробуй сделать смешное лицо на 10 секунд",
  "Скажи себе 'Я не знаю, что делаю, и это ок'",
  "Пошевели плечами, будто танцуешь на работе",
  "Напиши в заметках то, что тебе стыдно признать",
  "Скажи вслух то, о чем никто не знает",
  "Встань и потянись как будто показываешь что-то невидимое",
  "Покажи пальцем что-то, что не существует",
  "Сделай 3 шага назад и почувствуй себя шпионом",
  "Скажи 'Прости, что я живу' — тихо себе",
  "Подними брови и держи 10 секунд",
  "Скажи вслух 'Я боюсь, но делаю это'",
  "Пройдись по комнате, как будто идёшь по красной дорожке",
  "Покрутись на месте 3 раза и улыбайся",
  "Скажи случайному человеку 'Я вас не знаю, но привет!'",
  "Положи руку на сердце и скажи 'Мне жаль'",
  "Придумай короткий шепотный крик и сделай его",
  "Сделай серьезное лицо и смейся в голове",
  "Скажи вслух 'Я заслуживаю этого дискомфорта'",
  "Сделай шаг к двери, потом вернись и улыбнись",
  "Скажи себе 'Это глупо, но я делаю'",
  "Притворись, что ты супергерой и посмотри в окно",
  "Постой 10 секунд на одной ноге и считай",
  "Похлопай себя по плечу и скажи 'Я смог!'",
  "Скажи 'Прости' случайной вещи в комнате",
  "Напиши в заметках одну свою слабость",
  "Покрутися на месте и скажи 'Я свободен!'",
  "Встань и сделай странную позу на 10 секунд",
  "Скажи вслух 'Я не знаю, что будет, и это страшно'",
  "Подойди к окну и помаши кому-то воображаемому",
  "Закрой глаза и представь, что тебя кто-то наблюдает",
  "Скажи себе 'Я неидеален, и это ок'",
  "Прочитай вслух фразу, которая тебя смущает",
  "Сделай шаг в сторону и представь, что это важно",
  "Скажи 'Я стесняюсь, но я делаю это'",
  "Встань на носки и дыши глубоко",
  "Закрой глаза и улыбнись самой себе",
  "Подойди к стене и поклонись",
  "Скажи 'Я виноват(а) за что-то, и это нормально'",
  "Сделай смешное движение руками",
  "Напиши в заметках, что боишься",
  "Произнеси вслух первую мысль, которая придёт в голову",
  "Сделай 3 глубоких вдоха, представь, что кто-то смотрит",
  "Скажи 'Я странный, и это ок'",
  "Покрутись вокруг себя и громко выдохни",
  "Представь, что кто-то наблюдает, и улыбнись",
  "Скажи вслух фразу, которую обычно скрываешь",
  "Пройди 3 шага вперёд и назад, будто танцуешь",
  "Скажи себе 'Мне немного страшно'",
  "Напиши 1 свою слабость и сплюнь на неё (виртуально)",
  "Подними руки и крикни 'Я делаю это!' тихо",
  "Сделай смешное лицо и удерживай 5 секунд",
  "Скажи 'Прости, я делаю ошибки' вслух",
  "Встань и делай микродвижение, будто летишь",
  "Скажи вслух 'Я немного стесняюсь'",
  "Покажи пальцем пустое место и скажи 'Это важно'",
  "Сделай шаг назад и хлопни себя по плечу",
  "Скажи 'Я боюсь, но я продолжаю'",
  "Закрой глаза и вздохни глубоко",
  "Скажи вслух 'Мне неловко, но я делаю'",
  "Покрутись на месте и делай вид, что танцуешь",
  "Напиши в заметках то, что стыдно признать",
  "Сделай мини-танец на месте",
  "Скажи 'Простите, что я здесь' тихо",
  "Подойди к стене и притворись, что разговариваешь с ней",
  "Сделай шаг в сторону и замри",
  "Скажи себе 'Я странный, и это весело'",
  "Закрой глаза и смотри внутрь себя",
  "Сделай глубокий вдох и громко выдохни",
  "Скажи 'Я виноват(а) за мелочь, и это нормально'",
  "Подними плечи и сделай странное движение",
  "Скажи 'Мне немного страшно, но я делаю'",
  "Покажи пальцем на что-то невидимое и скажи 'Это важно!'",
  "Притворись, что кто-то наблюдает, и замри",
  "Скажи себе 'Мне немного неловко, и это ок'",
  "Встань и сделай шаг назад, улыбнись",
  "Скажи вслух фразу, которая вызывает стыд",
  "Закрой глаза и представь, что кто-то смотрит на тебя",
  "Сделай смешное движение руками",
  "Скажи 'Я немного глупо выгляжу, но делаю'",
  "Пройдись по комнате, как будто идёшь на сцену",
  "Скажи себе 'Мне страшно, и это нормально'",
  "Подними подбородок и замри на 5 секунд",
  "Скажи 'Я виноват(а) за что-то, и это ок'",
  "Встань и сделай мини-танец на месте",
  "Скажи вслух фразу, которую обычно скрываешь",
  "Закрой глаза и сделай глубокий вдох",
  "Скажи 'Мне немного неловко, но я продолжаю'",
  "Покрутись на месте и улыбнись себе",
  "Скажи 'Я боюсь, но делаю'",
  "Встань на носки и помаши руками",
  "Скажи себе 'Мне страшно, но я справлюсь'",
  "Сделай мини-скок и скажи 'Я сделал!'",
  "Закрой глаза и улыбнись себе",
  "Скажи 'Я стесняюсь, но делаю это'",
  "Сделай шаг вперёд и назад, как будто танцуешь",
  "Скажи вслух одну свою слабость",
  "Встань и сделай смешное лицо на 5 секунд",
  "Скажи 'Прости, что я такой(ая)'",
  "Подними руки и сделай странное движение",
  "Скажи себе 'Мне немного страшно и неловко', и улыбнись"
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
