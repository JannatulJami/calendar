const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span"),
    eventModal = document.querySelector(".event-modal"),
    modalContent = document.querySelector(".modal-content"),
    closeModal = document.querySelector(".close"),
    eventTitleInput = document.querySelector("#event-title"),
    eventTimeInput = document.querySelector("#event-time"),
    addEventBtn = document.querySelector("#add-event-btn"),
    eventList = document.querySelector("#event-list");

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

// Get stored events from localStorage
let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

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
        let dateStr = `${currYear}-${currMonth + 1}-${i}`;
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() &&
            currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}" data-date="${dateStr}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    document.querySelectorAll(".days li").forEach(day => {
        day.addEventListener("click", () => openEventModal(day));
    });
};

const openEventModal = (dayElement) => {
    let selectedDate = dayElement.getAttribute("data-date");
    eventModal.style.display = "flex";
    eventList.innerHTML = "";

    if (events[selectedDate]) {
        events[selectedDate].forEach(event => {
            let eventItem = document.createElement("div");
            eventItem.classList.add("event-item");
            eventItem.innerText = `${event.time} - ${event.title}`;
            eventList.appendChild(eventItem);
        });
    }

    addEventBtn.onclick = () => {
        let eventTitle = eventTitleInput.value.trim();
        let eventTime = eventTimeInput.value;

        if (eventTitle && eventTime) {
            if (!events[selectedDate]) {
                events[selectedDate] = [];
            }
            events[selectedDate].push({ title: eventTitle, time: eventTime });
            localStorage.setItem("calendarEvents", JSON.stringify(events));
            eventTitleInput.value = "";
            eventTimeInput.value = "";
            openEventModal(dayElement); // Refresh the event list
        }
    };
};

closeModal.addEventListener("click", () => {
    eventModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === eventModal) {
        eventModal.style.display = "none";
    }
});

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth =
