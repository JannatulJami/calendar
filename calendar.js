const currentDate = document.querySelector(".current-date"),
daysTag = document.querySelector(".days");
prevNextIcons= document.querySelectorAll(".icons span");

let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

const months = [ "January", "February", "March", "April", "May", "June", "July", 
                "August", "September, 'October", "November", "December"];
  
const renderCalendar = () => {
  let firstDayofMonth = new Date(currYear, currMonth, 1).getDate(), //Getting first day of month
   lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), //Getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), //gettong last day of the month
  lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); //Getting last date of month
let liTag = "";

   for (let i = firstDayofMonth; i > 0; i--) {
liTag += <li class = "inactive">${lastDateofLastMonth - i + 1}</li> ;
  }
  for (let i = 1; i <= lastDateofMonth; i++) {
    let isToday = i === date.getDate() && currMonth === new Date().getMonth()
            && currYear === new Date().getFullYear() ? "active" : "";
    liTag += <li class = "${isToday}">${i} </li> ;
  }
for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
  liTag += <li class = "inactive"> ${i - lastDayofLastMonth - i + 1}</li> ;
}
currentDate.innerText = ${months[currMonth]} ${currYear}; 
  daysTag.innerHTML = liTag;
}

renderCalendar (); 

prevNextIcon.forEach(icon => { 
icon.addEventListener("click", () => { // adding click event on both icons
  // if clicked icon is previous icon then document current month by 1 else increment it by 1
  currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
  renderCalendar();
});
});
