const tableBody = document.getElementById("calendar-table").getElementsByTagName("tbody")[0];
const currentMonthYear = document.getElementById("current-month-year");
let currentDate = new Date(2023, 7); // Setting initial date to August 2023

const holidays = [
    '1-1',   '1-6',   '1-26',  '5-1',   '6-6',   '8-15',  '10-2',  '12-25', '12-26'
];

function updateCurrentDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    document.getElementById("current-datetime").innerText = now.toLocaleDateString('en-US', options);
}
updateCurrentDateTime();
setInterval(updateCurrentDateTime, 1000);

function isHoliday(day, month) {
    return holidays.includes(`${month + 1}-${day}`);
}

function generateCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let tableContent = "";

    for (let i = 0; i < firstDay; i++) {
        tableContent += "<td></td>";
    }

    let today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        let isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
        if ((i + firstDay) % 7 === 0 && i !== daysInMonth) {
            tableContent += `<td${isHoliday(i, month) ? ' class="holiday"' : ''}${isToday ? ' class="current-date"' : ''}>${i}</td></tr><tr>`;
        } else {
            tableContent += `<td${isHoliday(i, month) ? ' class="holiday"' : ''}${isToday ? ' class="current-date"' : ''}>${i}</td>`;
        }
    }

    while ((daysInMonth + firstDay) % 7 !== 0) {
        tableContent += "<td></td>";
        daysInMonth++;
    }

    tableBody.innerHTML = tableContent;
    currentMonthYear.innerText = `${monthNames[month]} ${year}`;
    attachClickEventsToCells();
    populateLinksFromLocalStorage(month, year);
}

function handleCellClick(event) {
    const cell = event.target;
    const day = cell.innerText;
    const monthYear = currentMonthYear.innerText;
    const key = `${monthYear}-${day}`;
    
    const link = cell.getAttribute('data-link');
    if (link) {
        window.open(link, '_blank');
    } else {
        const newLink = prompt("Please enter a link:");
        if (newLink) {
            cell.setAttribute('data-link', newLink);
            cell.style.backgroundColor = "#e0e0e0";
            localStorage.setItem(key, newLink);
        }
    }
}

function attachClickEventsToCells() {
    const cells = document.querySelectorAll("#calendar-table td");
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
}

function populateLinksFromLocalStorage(month, year) {
    const cells = document.querySelectorAll("#calendar-table td");
    cells.forEach(cell => {
        const day = cell.innerText;
        const key = `${monthNames[month]} ${year}-${day}`;
        const link = localStorage.getItem(key);
        if (link) {
            cell.setAttribute('data-link', link);
            cell.style.backgroundColor = "#e0e0e0";
        }
    });
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

document.getElementById("prev-month").addEventListener("click", function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
});

document.getElementById("next-month").addEventListener("click", function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
});

generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
