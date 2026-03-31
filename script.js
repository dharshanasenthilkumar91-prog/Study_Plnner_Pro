let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* NAVIGATION */
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

/* TASKS */
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    let text = document.getElementById("taskInput").value;
    let date = document.getElementById("taskDate").value;

    if (text === "") { alert("Enter task"); return; }

    tasks.push({ text, date, completed: false });
    save();
    display();

    document.getElementById("taskInput").value = "";
    document.getElementById("taskDate").value = "";
}

function display() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");

        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
<span>
${task.text}
<br><small>📅 ${task.date ? task.date : "No date"}</small>
</span>
<div>
<button onclick="toggle(${index})">✔</button>
<button onclick="remove(${index})">❌</button>
</div>
`;

        list.appendChild(li);
    });

    updateProgress();
}

function toggle(i) {
    tasks[i].completed = !tasks[i].completed;
    save();
    display();
}

function remove(i) {
    tasks.splice(i, 1);
    save();
    display();
}

/* 🎉 CONFETTI FUNCTION */
function launchConfetti() {
    for (let i = 0; i < 80; i++) {
        let confetti = document.createElement("div");
        confetti.className = "confetti";

        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor =
            ["#a855f7", "#9333ea", "#c084fc", "#e879f9"][Math.floor(Math.random() * 4)];

        confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

/* PROGRESS */
function updateProgress() {
    let completed = tasks.filter(t => t.completed).length;
    let percent = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

    document.getElementById("circleText").innerText = percent + "%";

    let circle = document.getElementById("progressCircle");
    let degree = percent * 3.6;

    if (circle) {
        circle.style.background =
            `conic-gradient(#a855f7 ${degree}deg, #1e293b ${degree}deg)`;

        if (percent === 100) {
            circle.style.boxShadow = "0 0 20px #a855f7";
            launchConfetti();  // 🎉 TRIGGER HERE
        } else {
            circle.style.boxShadow = "none";
        }
    }
}

/* FOCUS TIMER */
let time = 0;
let timerInterval;
let isRunning = false;

/* START */
function startTimer() {

    if (isRunning) return;

    let input = document.getElementById("minutesInput").value;

    if (time === 0) {
        if (input === "" || input <= 0) {
            alert("Enter valid minutes");
            return;
        }
        time = input * 60;
    }

    isRunning = true;

    timerInterval = setInterval(() => {
        let min = Math.floor(time / 60);
        let sec = time % 60;

        document.getElementById("timer").innerText =
            `${min}:${sec < 10 ? "0" : ""}${sec}`;

        time--;

        if (time < 0) {
            clearInterval(timerInterval);
            isRunning = false;
            alert("⏰ Session Complete!");
            time = 0;
            document.getElementById("timer").innerText = "00:00";
        }
    }, 1000);
}

/* PAUSE */
function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

/* RESET */
function resetTimer() {
    clearInterval(timerInterval);
    time = 0;
    isRunning = false;
    document.getElementById("timer").innerText = "00:00";
    document.getElementById("minutesInput").value = "";
}

/* INIT */
display();