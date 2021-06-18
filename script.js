let allFilters = document.querySelectorAll(".filter div");
let grid = document.querySelector(".grid");
let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let isModalVisible = false;
let uid = new ShortUniqueId();
let colors = {
  pink: "#d595aa",
  blue: "#5ecdde",
  green: "#91e6c7",
  black: "black",
};
let colorClasses = ["pink", "blue", "green", "black"];
let deleteState = false;
let deleteBtn = document.querySelector(".delete");

//Initialisation Step
if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify([]));
}

deleteBtn.addEventListener("click", function (e) {
  if (deleteState) {
    deleteState = false;
    e.currentTarget.classList.remove("delete-state");
  } else {
    deleteState = true;
    e.currentTarget.classList.add("delete-state");
  }
});

for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", function (e) {
    let color = e.currentTarget.classList[0].split("-")[0];
    grid.style.backgroundColor = colors[color];
  });
}

addBtn.addEventListener("click", function (e) {
  if (isModalVisible) return;

  if (deleteBtn.classList.contains("delete-state")) {
    deleteState = false;
    deleteBtn.classList.remove("delete-state");
  }

  let modal = document.createElement("div");
  modal.classList.add("modal-container");
  modal.setAttribute("click-first", true);
  modal.innerHTML = `<div class="text-container" contenteditable>Enter Your Task...</div>
    <div class="filter-container">
      <div class="modal-filter pink"></div>
      <div class="modal-filter blue"></div>
      <div class="modal-filter green"></div>
      <div class="modal-filter black active-modal-filter"></div>
    </div>`;

  let allModalFilters = modal.querySelectorAll(".modal-filter");
  for (let i = 0; i < allModalFilters.length; i++) {
    allModalFilters[i].addEventListener("click", function (e) {
      for (let j = 0; j < allModalFilters.length; j++) {
        allModalFilters[j].classList.remove("active-modal-filter");
      }
      e.currentTarget.classList.add("active-modal-filter");
    });
  }

  let tc = modal.querySelector(".text-container");
  tc.addEventListener("click", function (e) {
    if (modal.getAttribute("click-first") == "true") {
      tc.innerHTML = "";
      modal.setAttribute("click-first", false);
    }
  });

  tc.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      let task = e.currentTarget.innerText;
      let selectModalFilter = document.querySelector(".active-modal-filter");
      let color = selectModalFilter.classList[1];
      let ticket = document.createElement("div");
      let id = uid();
      ticket.classList.add("ticket");
      ticket.innerHTML = `<div class="ticket-color ${color}"></div>
      <div class="ticket-id">#${id}</div>
      <div class="ticket-box" contenteditable>${task}</div>`;

      saveTicketInLocalStorage(id, color, task);

      let ticketWritingArea = ticket.querySelector(".ticket-box");
      ticketWritingArea.addEventListener("input", ticketWritingAreaHandler);

      ticket.addEventListener("click", function (e) {
        if (deleteState) {
          let id = e.currentTarget
            .querySelector(".ticket-id")
            .innerText.split("#")[1];

          let tasksArr = JSON.parse(localStorage.getItem("tasks"));

          tasksArr = tasksArr.filter(function (el) {
            return el.id != id;
          });

          localStorage.setItem("tasks", JSON.stringify(tasksArr));

          e.currentTarget.remove();
        }
      });

      let colorBtn = ticket.querySelector(".ticket-color");
      colorBtn.addEventListener("click", ticketColorHandler);
      
      grid.appendChild(ticket);
      modal.remove();
      isModalVisible = false;
    }
  });

  body.appendChild(modal);
  isModalVisible = true;
});

function saveTicketInLocalStorage(id, color, task) {
  let requiredObj = { id, color, task };
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  taskArr.push(requiredObj);
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function ticketWritingAreaHandler(e) {
  let id = e.currentTarget.parentElement
    .querySelector(".ticket-id")
    .innerText.split("#")[1];
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  let reqIndex = -1;
  for (let i = 0; i < taskArr.length; i++) {
    if (taskArr[i].id == id) {
      reqIndex = i;
      break;
    }
  }
  taskArr[reqIndex].task = e.currentTarget.innerText;
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function ticketColorHandler(e) {
  let id = e.currentTarget.parentElement
    .querySelector(".ticket-id")
    .innerText.split("#")[1];

  let tasksArr = JSON.parse(localStorage.getItem("tasks"));
  let reqIndex = -1;
  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].id == id) {
      reqIndex = i;
      break;
    }
  }

  let currColor = e.currentTarget.classList[1];
  let index = colorClasses.indexOf(currColor);
  index++;
  index = index % 4;
  e.currentTarget.classList.remove(currColor);
  e.currentTarget.classList.add(colorClasses[index]);
  tasksArr[reqIndex].color = colorClasses[index];
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}
