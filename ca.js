document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    const header = document.createElement("header");
    const currentDate = document.createElement("div");
    currentDate.className = "current-date";

    const icons = document.createElement("div");
    icons.className = "icons";
    const prev = document.createElement("span");
    prev.id = "prev";
    prev.innerHTML = "&#9664;";
    const next = document.createElement("span");
    next.id = "next";
    next.innerHTML = "&#9654;";
    icons.append(prev, next);

    header.append(currentDate, icons);
    wrapper.append(header);

    const calendar = document.createElement("div");
    calendar.className = "calendar";
    const weeks = document.createElement("ul");
    weeks.className = "weeks";
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
        const li = document.createElement("li");
        li.textContent = day;
        weeks.appendChild(li);
    });

    const days = document.createElement("ul");
    days.className = "days";
    calendar.append(weeks, days);
    wrapper.append(calendar);

    body.append(wrapper);

    const eventModal = document.createElement("div");
    eventModal.className = "event-modal";
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    const closeModal = document.createElement("span");
    closeModal.className = "close";
    closeModal.innerHTML = "&times;";
    const h2 = document.createElement("h2");
    h2.textContent = "Add Event";
    const eventTitleInput = document.createElement("input");
    eventTitleInput.type = "text";
    eventTitleInput.id = "event-title";
    eventTitleInput.placeholder = "Event Title";
    const eventTimeInput = document.createElement("input");
    eventTimeInput.type = "time";
    eventTimeInput.id = "event-time";
    const addEventBtn = document.createElement("button");
    addEventBtn.id = "add-event-btn";
    addEventBtn.textContent = "Add Event";
    const eventList = document.createElement("div");
    eventList.id = "event-list";

    modalContent.append(closeModal, h2, eventTitleInput, eventTimeInput, addEventBtn, eventList);
    eventModal.append(modalContent);
    body.append(eventModal);

    const daysTag = document.querySelector(".days"),
        prevNextIcon = document.querySelectorAll(".icons span");

    let date = new Date(),
        currYear = date.getFullYear(),
        currMonth = date.getMonth();

    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"];

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
                openEventModal(dayElement);
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
                currMonth = date.getMonth();
            } else {
                date = new Date();
            }

            renderCalendar();
        });
    });

    renderCalendar();
});

