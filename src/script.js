//Initial references
let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

//Events object
let events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },
  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend",
  },
};

let deviceType = "";

let history = [];

//Initially draw and erase would be false
let draw = false;
let erase = false;

//Detect touch device
const isTouchDevice = () => {
  try {
    //We try to create TouchEvent(it would fail for desktops and throw error)
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

isTouchDevice();

// 그리드 생성
gridButton.addEventListener("click", () => {
  // 이전 그리드를 삭제한다 (이전 그리드 삭제)
  container.innerHTML = "";

  // 행 생성
  for (let i = 0; i < gridHeight.value; i++) {
    // 행 div 생성
    const row = document.createElement("div");
    row.classList.add("gridRow");

    // 열 생성
    for (let j = 0; j < gridWidth.value; j++) {
      const column = document.createElement("div");
      column.classList.add("gridCol");
      column.setAttribute("id", `gridCol${i}-${j}`);

      // 그리기 이벤트 리스너 추가
      column.addEventListener(events[deviceType].down, () => {
        draw = true;
        if (erase) {
          column.style.backgroundColor = "transparent";
        } else {
          column.style.backgroundColor = colorButton.value;
        }
      });

      column.addEventListener(events[deviceType].move, (e) => {
        const elementId = document.elementFromPoint(
          !isTouchDevice() ? e.clientX : e.touches[0].clientX,
          !isTouchDevice() ? e.clientY : e.touches[0].clientY
        ).id;
        checker(elementId);
      });

      column.addEventListener(events[deviceType].up, () => {
        draw = false;
      });

      // 열을 행에 추가
      row.appendChild(column);
    }
    // 행을 컨테이너에 추가
    container.appendChild(row);
  }
});

function checker(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    if (draw && !erase) {
      element.style.backgroundColor = colorButton.value;
      history.push(container.innerHTML);
    } else if (draw && erase) {
      element.style.backgroundColor = "transparent";
      history.push(container.innerHTML);
    }
  }
}

//Clear Grid
clearGridButton.addEventListener("click", () => {
  container.innerHTML = "";
});
//Erase Button
eraseBtn.addEventListener("click", () => {
  erase = true;
});

//Paint button
paintBtn.addEventListener("click", () => {
  erase = false;
});

//Display grid width and height
gridWidth.addEventListener("input", () => {
  widthValue.innerHTML =
    gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
});

gridHeight.addEventListener("input", () => {
  heightValue.innerHTML =
    gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value;
});

window.onload = () => {
  gridWidth.value = 30;
  gridHeight.value = 30;
};
