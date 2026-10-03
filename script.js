// Clock Engine & Settings
let timeFormat = "24"; // "12" or "24"
let showSeconds = true;

function updateClock() {
  const now = new Date();
  let timeStr = "";
  
  if (timeFormat === "12") {
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (showSeconds) {
      const seconds = String(now.getSeconds()).padStart(2, '0');
      timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;
    } else {
      timeStr = `${hours}:${minutes} ${ampm}`;
    }
  } else {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (showSeconds) {
      const seconds = String(now.getSeconds()).padStart(2, '0');
      timeStr = `${hours}:${minutes}:${seconds}`;
    } else {
      timeStr = `${hours}:${minutes}`;
    }
  }

  document.getElementById("timeElement").innerText = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

function setTimeFormat(fmt) {
  timeFormat = fmt;
  updateClock();
}

function toggleSeconds() {
  showSeconds = !showSeconds;
  updateClock();
}

// Hostname customization
function applyHostname() {
  const input = document.getElementById("hostInput");
  const val = input.value.trim();
  if (!val) return;

  document.getElementById("startUserLabel").innerText = val.split('@')[0] || val;
  document.getElementById("termPromptUser").innerText = val;
  document.getElementById("termHeaderLabel").innerText = `bash -- ${val}:~#`;
}

// Theme Engine
function applyTheme(themeName) {
  document.body.className = themeName;
}

let biggestIndex = 10;
let selectedIcon = null;
const taskbar = document.getElementById("taskbar");
const taskbarApps = document.getElementById("taskbarApps");

// Start Menu Logic
let menuOpen = false;
document.getElementById('startBtn').addEventListener('click', function(e) {
  e.stopPropagation();
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

function updateTaskbarTab(windowId, isOpen) {
  const existingTab = document.getElementById("tab-" + windowId);
  if (isOpen && !existingTab) {
    const tab = document.createElement("div");
    tab.className = "taskbar-app-tab";
    tab.id = "tab-" + windowId;
    tab.innerText = windowId;
    tab.addEventListener("click", () => {
      const win = document.getElementById(windowId);
      if (win.style.display === "none") {
        win.style.display = "flex";
        handleWindowTap(win);
      } else {
        minimizeWindow(win);
      }
    });
    taskbarApps.appendChild(tab);
  } else if (!isOpen && existingTab) {
    existingTab.remove();
  }
}

function openWindow(element) {
  element.style.display = "flex";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  taskbar.style.zIndex = biggestIndex + 1;
  
  document.getElementById('startMenu').style.display = 'none';
  menuOpen = false;

  updateTaskbarTab(element.id, true);
}

function closeWindow(element) {
  element.style.display = "none";
  updateTaskbarTab(element.id, false);
}

function minimizeWindow(element) {
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
    if (e.target.classList.contains("control-btn")) return;
    
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

  const minBtn = document.getElementById(elementName + "min");
  if (minBtn) {
    minBtn.addEventListener("click", () => minimizeWindow(screen));
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
initializeWindow("paint");
initializeWindow("settings");

updateTaskbarTab("welcome", true);

// Start menu bindings
document.getElementById("welcomeopen").addEventListener("click", () => openWindow(document.getElementById("welcome")));
document.getElementById("startNotes").addEventListener("click", () => openWindow(document.getElementById("notes")));
document.getElementById("startNotepad").addEventListener("click", () => openWindow(document.getElementById("notepad")));
document.getElementById("startCalc").addEventListener("click", () => openWindow(document.getElementById("calc")));
document.getElementById("startPaint").addEventListener("click", () => openWindow(document.getElementById("paint")));
document.getElementById("startSettings").addEventListener("click", () => openWindow(document.getElementById("settings")));
document.getElementById("startSysinfo").addEventListener("click", () => openWindow(document.getElementById("sysinfo")));

document.body.addEventListener("click", (e) => {
  if (!e.target.closest(".app-icon") && selectedIcon) {
    deselectIcon(selectedIcon);
  }
  if(!e.target.closest('.start-menu') && e.target.id !== 'startBtn' && menuOpen) {
    document.getElementById('startMenu').style.display = 'none';
    menuOpen = false;
  }
});

// Notes App Data
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
    title: "Paint Canvas",
    date: "Session 04",
    content: "<h3>HTML5 Canvas API</h3><p>Added custom interactive 2D canvas context with real-time brush stroke rendering and color pallet selection.</p>"
  },
  {
    title: "Control Panel",
    date: "Session 05",
    content: "<h3>Settings Configuration</h3><p>Integrated theme manager, 12/24 clock formatter toggle, and runtime environment hostname customizer.</p>"
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
let clacInput = "";
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
    clacInput = String(eval(clacInput));
    document.getElementById("calcDisplay").innerText = clacInput;
  } catch (e) {
    clacInput = "Error";
    document.getElementById("calcDisplay").innerText = clacInput;
  }
}

// Paint Canvas Logic
const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
let painting = false;

function startPosition(e) {
  painting = true;
  draw(e);
}

function finishedPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = document.getElementById("paintBrushSize").value;
  ctx.lineCap = "round";
  ctx.strokeStyle = document.getElementById("paintColor").value;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", finishedPosition);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseleave", finishedPosition);
