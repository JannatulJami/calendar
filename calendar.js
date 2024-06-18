const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span"),
eventModal = document.querySelector(".event-modal"),
closeModalBtn = document.querySelector(".close"),
addEventBtn = document.getElementById("add-event-btn"),
eventTitleInput = document.getElementById("event-title"),
eventTimeInput = document.getElementById("event-time");

let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth(),
events = JSON.parse(localStorage.getItem("events")) || {};

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    
    let liTag = "";
    
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                      && currYear === new Date().getFullYear() ? "active" : "";
        let eventClass = events[`${currYear}-${currMonth}-${i}`] ? "event" : "";
        liTag += `<li class="${isToday} ${eventClass}" data-date="${i}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
    addDayClickListeners();
}
renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});

function addDayClickListeners() {
    const days = document.querySelectorAll(".days li");
    days.forEach(day => {
        day.addEventListener("click", () => {
            const dayNumber = day.getAttribute("data-date");
            showEventModal(dayNumber);
        });
    });
}

function showEventModal(day) {
    eventModal.style.display = "flex";
    eventModal.setAttribute("data-day", day);
}

closeModalBtn.addEventListener("click", () => {
    eventModal.style.display = "none";
});

addEventBtn.addEventListener("click", () => {
    const day = eventModal.getAttribute("data-day");
    const title = eventTitleInput.value;
    const time = eventTimeInput.value;

    if (title && time) {
        const eventDate = `${currYear}-${currMonth}-${day}`;
        events[eventDate] = events[eventDate] || [];
        events[eventDate].push({ title, time });
        localStorage.setItem("events", JSON.stringify(events));
        renderCalendar();
        eventModal.style.display = "none";
        eventTitleInput.value = "";
        eventTimeInput.value = "";
    }
});
