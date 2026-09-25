// Clock initialization
function updateClock() {
  const now = new Date();
  document.getElementById("timeElement").innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Window dragging functionality
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
    if (newTop < 38) newTop = 38;

    element.style.top = newTop + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Window visibility toggles
function closeWindow(element) {
  element.style.display = "none";
}

function openWindow(element) {
  element.style.display = "flex";
}

const welcomeWin = document.getElementById("welcome");
const welcomeClose = document.getElementById("welcomeclose");
const welcomeOpen = document.getElementById("welcomeopen");

dragElement(welcomeWin);

welcomeClose.addEventListener("click", () => closeWindow(welcomeWin));
welcomeOpen.addEventListener("click", () => openWindow(welcomeWin));