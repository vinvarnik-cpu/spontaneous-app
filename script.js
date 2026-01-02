// --- Список заданий (100 штук, можно заменить на свой массив)
const tasks = [
  "Сделай движение рукой", "Подними плечи и отпусти", "Скажи себе комплимент",
  "Посмотри в окно и найди что-то новое", "Сделай 5 глубоких вдохов",
  "Закрой глаза на 10 секунд", "Поменяй руку для телефона",
  "Посмотри на потолок и замри на 5 секунд", "Сделай движение ногами",
  "Положи руку на сердце", "Поверни голову на 90 градусов", "Выключи звук телефона",
  "Скажи «стоп» перед действием", "Найди новую деталь в комнате", "Пауза перед телефоном",
  "Одно правдивое слово рядом с кем-то", "Подними подбородок на улице", "Растяжка рук",
  "Закрой глаза и слушай звуки", "Другая поза на стуле", // ...дополнить до 100
];

// --- Настройки ---
let settings = { tasksPerDay: 1, startHour: 9, endHour: 21 };
let completedToday = 0;
let currentTimer;
let timeLeft = 120;

// --- Элементы ---
const taskText = document.getElementById("task");
const getTaskBtn = document.getElementById("getTaskBtn");
const actions = document.getElementById("actions");
const timerEl = document.getElementById("timer");
const doneBtn = document.querySelector(".done");
const skipBtn = document.querySelector(".skip");
const settingsBtn = document.getElementById("settingsBtn");

// --- Загрузка настроек ---
if (localStorage.getItem("settings")) {
  settings = JSON.parse(localStorage.getItem("settings"));
}

// --- Функция показа задания ---
function showTask() {
  let shownTasks = JSON.parse(localStorage.getItem("shownTasks") || "[]");
  if (completedToday >= settings.tasksPerDay) {
    taskText.innerText = `На сегодня выполнено ${completedToday}/${settings.tasksPerDay}`;
    return;
  }
  const remainingTasks = tasks.filter(t => !shownTasks.includes(t));
  if (remainingTasks.length === 0) {
    taskText.innerText = "Все задания уже были! Сбросим круг.";
    localStorage.removeItem("shownTasks");
    return;
  }
  const task = remainingTasks[Math.floor(Math.random() * remainingTasks.length)];
  taskText.innerText = task;
  shownTasks.push(task);
  localStorage.setItem("shownTasks", JSON.stringify(shownTasks));
  actions.classList.remove("hidden");
  startTimer();
}

// --- Таймер ---
function startTimer() {
  clearInterval(currentTimer);
  timeLeft = 120;
  updateTimer();
  currentTimer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) clearInterval(currentTimer);
  }, 1000);
}

function updateTimer() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  timerEl.innerText = `⏱ ${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// --- Кнопки ---
getTaskBtn.onclick = showTask;
doneBtn.onclick = () => {
  clearInterval(currentTimer);
  completedToday++;
  taskText.innerText = `⚡ Засчитано! ${completedToday}/${settings.tasksPerDay} выполнено`;
  actions.classList.add("hidden");
};
skipBtn.onclick = () => {
  clearInterval(currentTimer);
  completedToday = settings.tasksPerDay;
  taskText.innerText = `Пропущено. День закрыт (${completedToday}/${settings.tasksPerDay})`;
  actions.classList.add("hidden");
};

// --- Настройки ---
settingsBtn.onclick = () => {
  let input = prompt("Сколько заданий в день? (минимум 1)", settings.tasksPerDay);
  input = parseInt(input);
  if (input >= 1) {
    settings.tasksPerDay = input;
    localStorage.setItem("settings", JSON.stringify(settings));
    alert(`Настройки сохранены: ${settings.tasksPerDay} заданий в день`);
  } else {
    alert("Минимум 1 задание обязательно");
  }
};

// --- Спонтанные уведомления ---
function scheduleNotifications() {
  for (let i = 0; i < settings.tasksPerDay; i++) {
    const now = new Date();
    const start = new Date();
    start.setHours(settings.startHour, 0, 0, 0);
    const end = new Date();
    end.setHours(settings.endHour, 0, 0, 0);
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const delay = randomTime - now.getTime();
    if (delay > 0) {
      setTimeout(() => {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("⚡ Спонтанное задание", {
            body: "Нажми, чтобы увидеть новое задание!",
            icon: "icon.png"
          });
        } else {
          alert("⚡ Спонтанное задание! Открой приложение");
        }
      }, delay);
    }
  }
}

// --- Разрешение уведомлений ---
if ("Notification" in window) {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") scheduleNotifications();
  });
}
