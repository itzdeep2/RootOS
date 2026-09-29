function updateClock() {
  const now = new Date();
  document.getElementById("timeElement").innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

let biggestIndex = 10;
let selectedIcon = null;
const taskbar = document.getElementById("taskbar");

// Start Menu Logic
let menuOpen = false;
document.getElementById('startBtn').addEventListener('click', function() {
  const menu = document.getElementById('startMenu');
  if(menuOpen) {
    menu.style.display = 'none';
    menuOpen = false;
  } else {
    menu.style.display = 'flex';
    menuOpen = true;
    biggestIndex++;
    menu.style.zIndex = biggestIndex + 2;
  }
});

function openWindow(element) {
  element.style.display = "flex";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  taskbar.style.zIndex = biggestIndex + 1;
  
  document.getElementById('startMenu').style.display = 'none';
  menuOpen = false;
}

function closeWindow(element) {
  element.style.display = "none";
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  taskbar.style.zIndex = biggestIndex + 1;
  if (selectedIcon) deselectIcon(selectedIcon);
}

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (!element) return;
  element.classList.remove("selected");
  selectedIcon = null;
}

function handleIconTap(iconElement, windowElement) {
  if (iconElement.classList.contains("selected")) {
    deselectIcon(iconElement);
    openWindow(windowElement);
  } else {
    if (selectedIcon) deselectIcon(selectedIcon);
    selectIcon(iconElement);
  }
}

function dragElement(element) {
  let initialX = 0, initialY = 0;
  let currentX = 0, currentY = 0;

  const header = document.getElementById(element.id + "header") || element;
  header.onmousedown = startDragging;

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = moveElement;
  }

  function moveElement(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    let newTop = element.offsetTop - currentY;
    if (newTop < 0) newTop = 0; 

    element.style.top = newTop + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function initializeWindow(elementName) {
  const screen = document.getElementById(elementName);
  if (!screen) return;

  screen.addEventListener("mousedown", () => handleWindowTap(screen));
  dragElement(screen);

  const closeBtn = document.getElementById(elementName + "close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeWindow(screen));
  }

  const icon = document.getElementById(elementName + "Icon");
  if (icon) {
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      handleIconTap(icon, screen);
    });
  }
}

initializeWindow("welcome");
initializeWindow("notes");
initializeWindow("sysinfo");
initializeWindow("notepad");
initializeWindow("calc");

// Start menu app bindings
document.getElementById("welcomeopen").addEventListener("click", () => openWindow(document.getElementById("welcome")));
document.getElementById("startNotes").addEventListener("click", () => openWindow(document.getElementById("notes")));
document.getElementById("startNotepad").addEventListener("click", () => openWindow(document.getElementById("notepad")));
document.getElementById("startCalc").addEventListener("click", () => openWindow(document.getElementById("calc")));

document.body.addEventListener("click", (e) => {
  if (!e.target.closest(".app-icon") && selectedIcon) {
    deselectIcon(selectedIcon);
  }
  if(!e.target.closest('.start-menu') && e.target.id !== 'startBtn' && menuOpen) {
    document.getElementById('startMenu').style.display = 'none';
    menuOpen = false;
  }
});

// Notes App
const devLogs = [
  {
    title: "Kernel Init",
    date: "Session 01",
    content: "<h3>System Boot Sequence</h3><p>Initialized base document structure, set up interval clock, and verified draggable coordinate calculations.</p>"
  },
  {
    title: "Mesh Setup",
    date: "Session 02",
    content: "<h3>Tailscale Mesh Routing</h3><p>Configured peer routing table for server sync across local and remote stations without port forwarding.</p>"
  },
  {
    title: "Keystroke HID",
    date: "Session 03",
    content: "<h3>Hardware Automation</h3><p>Flashed ATtiny85 microcontroller with custom USB HID payloads for one-touch dev terminal execution.</p>"
  }
];

function setNotesContent(index) {
  const notesBody = document.getElementById("notesContent");
  if (notesBody && devLogs[index]) {
    notesBody.innerHTML = devLogs[index].content;
  }
}

function populateNotesSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  sidebar.innerHTML = "";

  devLogs.forEach((note, index) => {
    const entry = document.createElement("div");
    entry.className = "sidebar-entry";
    entry.innerHTML = `
      <div class="sidebar-entry-title">${note.title}</div>
      <div class="sidebar-entry-date">${note.date}</div>
    `;
    entry.addEventListener("click", () => setNotesContent(index));
    sidebar.appendChild(entry);
  });

  setNotesContent(0);
}

populateNotesSidebar();

// Calculator logic
let clacInput = ""; // slight typo here
function calcInput(val) {
  if(clacInput === "0" || clacInput === "Error") {
    clacInput = val;
  } else {
    clacInput += val;
  }
  document.getElementById("calcDisplay").innerText = clacInput;
}

function calcClear() {
  clacInput = "0";
  document.getElementById("calcDisplay").innerText = clacInput;
}

function calcEval() {
  try {
    // using basic eval for the simple calulator
    clacInput = String(eval(clacInput));
    document.getElementById("calcDisplay").innerText = clacInput;
  } catch (e) {
    clacInput = "Error";
    document.getElementById("calcDisplay").innerText = clacInput;
  }
}
