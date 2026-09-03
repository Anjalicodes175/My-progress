/* =====================================================
   MY PROGRESS
   Main JavaScript File
   ===================================================== */


/* =====================================================
   1. CONFIGURATION
   Future design/basic changes yahan se kiye ja sakte hain
   ===================================================== */

const CONFIG = {

    appName: "My Progress",

    storageKey: "myProgressData_v1",

    firstDayOfWeek: 1,

    missedColor: "red",

    // Habit points
    completedPoint: 1,
    missedPoint: 0
};


/* =====================================================
   HABIT EMOJI AUTO MATCHING
   ===================================================== */

const HABIT_EMOJIS = [

    {
        keywords: [
            "study",
            "studying",
            "padhai",
            "learning",
            "learn",
            "education",
            "college",
            "exam"
        ],
        emoji: "📚"
    },

    {
        keywords: [
            "exercise",
            "workout",
            "gym",
            "fitness",
            "running",
            "run",
            "walk",
            "yoga"
        ],
        emoji: "🏋️"
    },

    {
        keywords: [
            "saving",
            "save",
            "money",
            "finance",
            "budget",
            "investment",
            "invest"
        ],
        emoji: "💰"
    },

    {
        keywords: [
            "reading",
            "read",
            "book",
            "novel"
        ],
        emoji: "📖"
    },

    {
        keywords: [
            "water",
            "drink water",
            "hydration",
            "pani"
        ],
        emoji: "💧"
    },

    {
        keywords: [
            "sleep",
            "sleeping",
            "rest",
            "bed"
        ],
        emoji: "🌙"
    },

    {
        keywords: [
            "meditation",
            "meditate",
            "mindfulness",
            "peace"
        ],
        emoji: "🧘"
    },

    {
        keywords: [
            "self care",
            "selfcare",
            "skincare",
            "skin care"
        ],
        emoji: "🫶"
    },

    {
        keywords: [
            "coding",
            "code",
            "programming",
            "developer",
            "website"
        ],
        emoji: "💻"
    },

    {
        keywords: [
            "work",
            "job",
            "office",
            "deep work"
        ],
        emoji: "💼"
    },

    {
        keywords: [
            "food",
            "healthy food",
            "diet",
            "eat healthy"
        ],
        emoji: "🥗"
    },

    {
        keywords: [
            "journal",
            "journaling",
            "diary"
        ],
        emoji: "📓"
    }
];


function getHabitEmoji(habitName) {

    const name =
        habitName.toLowerCase().trim();


    for (const habitType of HABIT_EMOJIS) {

        const matched =
            habitType.keywords.some(
                keyword =>
                    name.includes(keyword)
            );


        if (matched) {
            return habitType.emoji;
        }
    }


    // Agar koi matching category nahi mili
    return "✦";
}


/* =====================================================
   2. APP STATE
   ===================================================== */

let appData = loadData();

let selectedDate = new Date();

function resetToCurrentMonth() {
    const today = new Date();
    
    selectedDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );
}

let selectedEmoji = "✨";


/* =====================================================
   3. INITIAL DATA
   ===================================================== */

function createEmptyData() {

    return {
        habits: [],
        months: {},
        theme: "dark"
    };
}


/* =====================================================
   4. LOCAL STORAGE
   ===================================================== */

function loadData() {

    const savedData =
        localStorage.getItem(CONFIG.storageKey);

    if (!savedData) {
        return createEmptyData();
    }

    try {

        return JSON.parse(savedData);

    } catch (error) {

        console.error("Data loading error:", error);

        return createEmptyData();
    }
}


function saveData() {

    localStorage.setItem(
        CONFIG.storageKey,
        JSON.stringify(appData)
    );
}


/* =====================================================
   5. DATE FUNCTIONS
   ===================================================== */

function getYear() {
    return selectedDate.getFullYear();
}


function getMonth() {
    return selectedDate.getMonth();
}


function getMonthKey() {

    return `${getYear()}-${String(getMonth() + 1).padStart(2, "0")}`;
}


function getDaysInMonth(year, month) {

    return new Date(
        year,
        month + 1,
        0
    ).getDate();
}


function getToday() {

    const today = new Date();

    return {
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate()
    };
}


function isToday(day) {

    const today = getToday();

    return (
        today.year === getYear() &&
        today.month === getMonth() &&
        today.day === day
    );
}


function isFutureDay(day) {

    const today = getToday();

    const currentMonthKey =
        `${today.year}-${String(today.month + 1).padStart(2, "0")}`;

    const selectedMonthKey = getMonthKey();

    if (selectedMonthKey > currentMonthKey) {
        return true;
    }

    if (selectedMonthKey < currentMonthKey) {
        return false;
    }

    return day > today.day;
}


/* =====================================================
   6. MONTH DATA
   ===================================================== */

function getMonthData() {

    const key = getMonthKey();

    if (!appData.months[key]) {

        appData.months[key] = {
            habits: {},
            sleep: {},
            moods: {},
            notes: {}
        };

        saveData();
    }

    return appData.months[key];
}


/* =====================================================
   7. HEADER / MONTH UI
   ===================================================== */

function renderMonthInfo() {

    const monthName =
        selectedDate.toLocaleString("en-US", {
            month: "long"
        });

    const days =
        getDaysInMonth(
            getYear(),
            getMonth()
        );

    document.getElementById("monthLabel").textContent =
        `${monthName} ${getYear()}`;

    document.getElementById("monthDaysLabel").textContent =
        `${days} days`;

    const today = getToday();

    if (
        today.year === getYear() &&
        today.month === getMonth()
    ) {

        document.getElementById("currentDay").textContent =
            `${String(today.day).padStart(2, "0")} / ${days}`;

    } else {

        document.getElementById("currentDay").textContent =
            `— / ${days}`;
    }
}


/* =====================================================
   8. HABIT TABLE
   ===================================================== */

function renderHabitTable() {

    const header =
        document.getElementById("habitHeaderRow");

    const body =
        document.getElementById("habitTableBody");

    const totalRow =
        document.getElementById("totalPointsRow");

    const emptyState =
        document.getElementById("habitEmptyState");

    const days =
        getDaysInMonth(
            getYear(),
            getMonth()
        );

    header.innerHTML = "";

    body.innerHTML = "";

    totalRow.innerHTML = "";


    /* ---------- HEADER ---------- */

    const firstHeader =
        document.createElement("th");

    firstHeader.className = "habit-name-cell";

    firstHeader.textContent = "HABITS / RULES";

    header.appendChild(firstHeader);


    for (let day = 1; day <= days; day++) {

        const th =
            document.createElement("th");

        th.className = "day-cell";

        th.textContent = day;

        if (isToday(day)) {
            th.classList.add("current-day");
        }

        header.appendChild(th);
    }

    function calculateTotalPoints() {

    const days =
        getDaysInMonth(
            getYear(),
            getMonth()
        );

    let total = 0;


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        if (!isFutureDay(day)) {

            total += getDayPoints(day);
        }
    }


    return total;
}

function calculatePerfectDays() {

    if (appData.habits.length === 0) {
        return 0;
    }


    const days =
        getDaysInMonth(
            getYear(),
            getMonth()
        );

    let perfectDays = 0;


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        if (isFutureDay(day)) {
            continue;
        }


        const allCompleted =
            appData.habits.every(
                habit =>
                    getHabitStatus(
                        habit.id,
                        day
                    ) === "completed"
            );


        if (allCompleted) {
            perfectDays++;
        }
    }


    return perfectDays;
}

function calculateBestStreak() {

    if (appData.habits.length === 0) {
        return 0;
    }


    const today =
        getToday();

    let best = 0;
    let current = 0;


    for (
        let day = 1;
        day <= today.day;
        day++
    ) {

        const allCompleted =
            appData.habits.every(
                habit =>
                    getHabitStatus(
                        habit.id,
                        day
                    ) === "completed"
            );


        if (allCompleted) {

            current++;

            best =
                Math.max(
                    best,
                    current
                );

        } else {

            current = 0;
        }
    }


    return best;
}

function renderConsistency() {

    const container =
        document.getElementById(
            "consistencyGrid"
        );

    container.innerHTML = "";


    const today =
        getToday();


    const startDay =
        Math.max(
            1,
            today.day - 6
        );


    for (
        let day = startDay;
        day <= today.day;
        day++
    ) {

        const item =
            document.createElement("div");

        item.className =
            "consistency-day";


        const label =
            document.createElement("div");

        label.className =
            "consistency-day-label";

        label.textContent =
            day;


        const dot =
            document.createElement("div");

        dot.className =
            "consistency-dot";


        let allCompleted = false;


        if (appData.habits.length > 0) {

            allCompleted =
                appData.habits.every(
                    habit =>
                        getHabitStatus(
                            habit.id,
                            day
                        ) === "completed"
                );
        }


        if (allCompleted) {

            dot.classList.add(
                "completed"
            );

            dot.textContent = "✓";

        } else {

            dot.classList.add(
                "missed"
            );

            dot.textContent = "×";
        }


        item.appendChild(label);
        item.appendChild(dot);

        container.appendChild(item);
    }
}




    /* ---------- HABITS ---------- */

    appData.habits.forEach((habit, habitIndex) => {

        const row =
            document.createElement("tr");

        const nameCell =
            document.createElement("td");

        nameCell.className = "habit-name-cell";

        nameCell.innerHTML =
            `${habit.emoji} ${escapeHTML(habit.name)}`;

        row.appendChild(nameCell);


        for (let day = 1; day <= days; day++) {

            const cell =
                document.createElement("td");

            cell.className =
                "habit-cell day-cell";

            const status =
                getHabitStatus(
                    habit.id,
                    day
                );


            /* Current day */

            if (isToday(day)) {
                cell.classList.add("current-day");
            }


            /* Future day */

            if (isFutureDay(day)) {

                cell.classList.add("future");

                cell.textContent = "○";

            } else {

                if (status === "completed") {

                    cell.classList.add("completed");

                } else if (status === "missed") {

                    cell.classList.add("missed");

                } else {

                    cell.textContent = "○";
                }

                cell.addEventListener(
                    "click",
                    () => toggleHabit(habit.id, day)
                );
            }

            row.appendChild(cell);
        }

        body.appendChild(row);
    });


    /* ---------- TOTAL ---------- */

    const totalLabel =
        document.createElement("td");

    totalLabel.className =
        "habit-name-cell total-label";

    totalLabel.textContent =
        "TOTAL POINTS";

    totalRow.appendChild(totalLabel);


    for (let day = 1; day <= days; day++) {

        const td =
            document.createElement("td");

        td.className =
            "day-cell total-value";

        td.textContent =
            getDayPoints(day);

        if (isToday(day)) {
            td.classList.add("current-day");
        }

        totalRow.appendChild(td);
    }


    /* Empty state */

    if (appData.habits.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";
    }
}


/* =====================================================
   9. HABIT STATUS
   ===================================================== */

function getHabitStatus(habitId, day) {

    const monthData = getMonthData();

    if (
        monthData.habits[habitId] &&
        monthData.habits[habitId][day]
    ) {

        return monthData.habits[habitId][day];
    }


    /*
       Past day + no completion = missed
    */

    if (!isFutureDay(day) && !isToday(day)) {
        return "missed";
    }

    return "pending";
}


/* =====================================================
   10. TOGGLE HABIT
   ===================================================== */

function toggleHabit(habitId, day) {

    if (isFutureDay(day)) {
        return;
    }

    const monthData =
        getMonthData();

    if (!monthData.habits[habitId]) {

        monthData.habits[habitId] = {};
    }

    const currentStatus =
        monthData.habits[habitId][day];


    if (currentStatus === "completed") {

        delete monthData.habits[habitId][day];

    } else {

        monthData.habits[habitId][day] =
            "completed";
    }


    saveData();

    renderAll();
}


/* =====================================================
   11. DAY POINTS
   ===================================================== */

function getDayPoints(day) {

    let points = 0;

    appData.habits.forEach(habit => {

        if (
            getHabitStatus(
                habit.id,
                day
            ) === "completed"
        ) {

            points += CONFIG.completedPoint;
        }
    });

    return points;
}


/* =====================================================
   12. ADD HABIT
   ===================================================== */

function addHabit() {

    const input =
        document.getElementById(
            "habitNameInput"
        );

    const name =
        input.value.trim();


    if (!name) {

        input.focus();

        return;
    }


    const newHabit = {

        id:
            Date.now().toString(),

        name: name,

        emoji: getHabitEmoji(name)
    };


    appData.habits.push(newHabit);

    saveData();


    input.value = "";

    selectedEmoji = "✨";

    closeHabitModal();

    renderAll();
}


/* =====================================================
   13. SLEEP TRACKER
   ===================================================== */

const sleepOptions = [
    "9+",
    "8",
    "7",
    "6",
    "5",
    "<5"
];


function renderSleepTable() {

    const header =
        document.getElementById(
            "sleepHeaderRow"
        );

    const body =
        document.getElementById(
            "sleepTableBody"
        );

    const days =
        getDaysInMonth(
            getYear(),
            getMonth()
        );

    const sleepSelect =
        document.getElementById("sleepSelect");
        
    const today =
        getToday();

    const isCurrentMonth =
        today.year === getYear() &&
        today.month === getMonth();
        
    if (sleepSelect) {

        if (isCurrentMonth){

            sleepSelect.value =
               getMonthData().sleep[today.day] || "";
        } else{
            sleepSelect.value = "";
        }
    }    


    header.innerHTML = "";

    body.innerHTML = "";


    const firstHeader =
        document.createElement("th");

    firstHeader.className =
        "habit-name-cell";

    firstHeader.textContent = "HOURS";

    header.appendChild(firstHeader);


    for (let day = 1; day <= days; day++) {

        const th =
            document.createElement("th");

        th.className = "day-cell";

        th.textContent = day;

        if (isToday(day)) {
            th.classList.add("current-day");
        }

        header.appendChild(th);
    }


    sleepOptions.forEach(option => {

        const row =
            document.createElement("tr");

        const label =
            document.createElement("td");

        label.className =
            "habit-name-cell";

        label.textContent =
            option === "9+"
                ? "9+ hrs"
                : option === "<5"
                    ? "< 5 hrs"
                    : `${option} hrs`;

        row.appendChild(label);


        for (let day = 1; day <= days; day++) {

            const cell =
                document.createElement("td");

            cell.className =
                "sleep-cell day-cell";

            cell.textContent = "○";


            const selectedSleep =
                getMonthData().sleep[day];


            if (
                selectedSleep === option
            ) {

                cell.classList.add("selected");

                cell.textContent = "●";
            }


            if (isToday(day)) {
                cell.classList.add("current-day");
            }


            if (!isFutureDay(day)) {

                cell.addEventListener(
                    "click",
                    () => setSleep(day, option)
                );
            }


            row.appendChild(cell);
        }

        body.appendChild(row);
    });
}


function setSleep(day, option) {

    getMonthData().sleep[day] = option;

    saveData();

    renderSleepTable();

    updateTodaySummary();
}


/* =====================================================
   14. MOOD
   ===================================================== */

function setupMoodButtons() {

    const buttons =
        document.querySelectorAll(
            ".mood-options button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const mood =
                    button.dataset.mood;

                getMonthData().moods[getToday().day] =
                    mood;

                saveData();

                renderMood();
            }
        );
    });
}


function renderMood() {

    const today =
        getToday();

    const currentMonth =
        getMonthKey();

    const isCurrentMonth =
        today.year === getYear() &&
        today.month === getMonth();


    document
        .querySelectorAll(".mood-options button")
        .forEach(button => {

            button.classList.remove("selected");

            if (!isCurrentMonth) {
                return;
            }

            if (
                getMonthData().moods[today.day] ===
                button.dataset.mood
            ) {

                button.classList.add("selected");
            }
        });
}


/* =====================================================
   15. NOTES
   ===================================================== */

function loadNotes() {

    const today =
        getToday();

    const notes =
        getMonthData().notes[today.day] || "";

    document.getElementById(
        "dailyNotes"
    ).value = notes;
}


function saveNotes() {

    const today =
        getToday();

    getMonthData().notes[today.day] =
        document.getElementById(
            "dailyNotes"
        ).value;

    saveData();
}


/* =====================================================
   16. PROGRESS SUMMARY
   ===================================================== */

function updateTodaySummary() {

    const today =
        getToday();


    if (
        today.year !== getYear() ||
        today.month !== getMonth()
    ) {

        document.getElementById(
            "todayScore"
        ).textContent = "—";

        document.getElementById(
            "progressPercentage"
        ).textContent = "—";

        return;
    }


    let completed = 0;

    appData.habits.forEach(habit => {

        if (
            getHabitStatus(
                habit.id,
                today.day
            ) === "completed"
        ) {

            completed++;
        }
    });


    const total =
        appData.habits.length;


    document.getElementById(
        "todayScore"
    ).textContent =
        `${completed} / ${total}`;


    const days =
        getDaysInMonth(
            getYear(),
            getMonth()
        );


    let completedCells = 0;

    let possibleCells = 0;


    for (let day = 1; day <= days; day++) {

        if (!isFutureDay(day)) {

            appData.habits.forEach(habit => {

                possibleCells++;

                if (
                    getHabitStatus(
                        habit.id,
                        day
                    ) === "completed"
                ) {

                    completedCells++;
                }
            });
        }
    }


    const percentage =
        possibleCells === 0
            ? 0
            : Math.round(
                (completedCells / possibleCells) * 100
            );


    document.getElementById(
        "progressPercentage"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "streakCount"
    ).textContent =
        `${calculateStreak()} days`;
}


/* =====================================================
   17. STREAK
   ===================================================== */

function calculateStreak() {

    const today =
        getToday();

    let streak = 0;

    let day = today.day;


    while (day >= 1) {

        if (appData.habits.length === 0) {
            break;
        }


        const allCompleted =
            appData.habits.every(
                habit =>
                    getHabitStatus(
                        habit.id,
                        day
                    ) === "completed"
            );


        if (!allCompleted) {
            break;
        }


        streak++;

        day--;
    }


    return streak;
}





/* =====================================================
   19. MODAL
   ===================================================== */

function openHabitModal() {

    document
        .getElementById("habitModal")
        .classList.add("open");

    document
        .getElementById("habitNameInput")
        .focus();
}


function closeHabitModal() {

    document
        .getElementById("habitModal")
        .classList.remove("open");
}


function setupEmojiPicker() {

    document
        .querySelectorAll(
            "#emojiPicker button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedEmoji =
                        button.dataset.emoji;

                    document
                        .querySelectorAll(
                            "#emojiPicker button"
                        )
                        .forEach(item =>
                            item.classList.remove(
                                "selected"
                            )
                        );

                    button.classList.add(
                        "selected"
                    );
                }
            );
        });
}


/* =====================================================
   20. THEME
   ===================================================== */

function setupTheme() {

    const button =
        document.getElementById(
            "themeButton"
        );


    button.addEventListener(
        "click",
        () => {

            /*
              Full light theme hum next phase
              mein add kar sakte hain.
            */

            document.body.classList.toggle(
                "light-mode"
            );
        }
    );
}


/* =====================================================
   20.5 PROGRESS PAGE
   ===================================================== */

function getMonthProgressData() {

    const days =
        getDaysInMonth(
            getYear(),
            getMonth()
        );

    let completedCells = 0;
    let possibleCells = 0;

    for (let day = 1; day <= days; day++) {

        if (!isFutureDay(day)) {

            appData.habits.forEach(habit => {

                possibleCells++;

                if (
                    getHabitStatus(
                        habit.id,
                        day
                    ) === "completed"
                ) {

                    completedCells++;
                }
            });
        }
    }

    const percentage =
        possibleCells === 0
            ? 0
            : Math.round(
                (completedCells / possibleCells) * 100
            );

    return {
        days,
        completedCells,
        possibleCells,
        percentage
    };
}


function renderProgressPage() {

    const data =
        getMonthProgressData();


    /* ---------- MONTH ---------- */

    const monthName =
        selectedDate.toLocaleString(
            "en-US",
            {
                month: "long"
            }
        );

    document.getElementById(
        "progressMonthTitle"
    ).textContent =
        `${monthName} ${getYear()}`;


    /* ---------- MAIN PROGRESS ---------- */

    document.getElementById(
        "progressMainPercentage"
    ).textContent =
        `${data.percentage}%`;

    document.getElementById(
        "progressMainBar"
    ).style.width =
        `${data.percentage}%`;


    /* ---------- MESSAGE ---------- */

    let message =
        "Start your journey. ✨";

    if (data.percentage >= 80) {
        message =
            "You're absolutely crushing it. ✨";
    } else if (data.percentage >= 60) {
        message =
            "You're doing pretty good. Keep going. 💜";
    } else if (data.percentage >= 30) {
        message =
            "You're building momentum. 🌱";
    } else if (data.percentage > 0) {
        message =
            "Every small step counts. ✦";
    }

    document.getElementById(
        "progressMessage"
    ).textContent = message;


    /* ---------- STATS ---------- */

    document.getElementById(
        "progressBestStreak"
    ).textContent =
        calculateBestStreak();


    document.getElementById(
        "progressTotalPoints"
    ).textContent =
        calculateTotalPoints();


    document.getElementById(
        "progressCompletedDays"
    ).textContent =
        calculatePerfectDays();


    /* ---------- HABITS ---------- */

    renderHabitPerformance();


    /* ---------- CONSISTENCY ---------- */

    renderConsistency();
}

function renderHabitPerformance() {

    const container =
        document.getElementById(
            "habitPerformanceList"
        );

    container.innerHTML = "";


    if (appData.habits.length === 0) {

        container.innerHTML =
            `<p style="opacity:.6;">
                Add a habit to see your progress. ✦
            </p>`;

        return;
    }


    const days =
        getDaysInMonth(
            getYear(),
            getMonth()
        );


    appData.habits.forEach(habit => {

        let completed = 0;
        let possible = 0;


        for (
            let day = 1;
            day <= days;
            day++
        ) {

            if (!isFutureDay(day)) {

                possible++;

                if (
                    getHabitStatus(
                        habit.id,
                        day
                    ) === "completed"
                ) {

                    completed++;
                }
            }
        }


        const percentage =
            possible === 0
                ? 0
                : Math.round(
                    (completed / possible) * 100
                );


        const item =
            document.createElement("div");

        item.className =
            "habit-performance-item";


        item.innerHTML = `

            <div class="habit-performance-top">

                <span class="habit-performance-name">
                    ${habit.emoji}
                    ${escapeHTML(habit.name)}
                </span>

                <span class="habit-performance-percent">
                    ${percentage}%
                </span>

            </div>


            <div class="habit-performance-bar">

                <div
                    class="habit-performance-fill"
                    style="width:${percentage}%">
                </div>

            </div>
        `;


        container.appendChild(item);
    });
}

/* =====================================================
   20.8 HISTORY PAGE
   ===================================================== */

let historyDate = new Date();


function resetHistoryToCurrentMonth() {

    const today = new Date();

    historyDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );
}


/* ---------- HISTORY MONTH ---------- */

function getHistoryYear() {
    return historyDate.getFullYear();
}


function getHistoryMonth() {
    return historyDate.getMonth();
}


function getHistoryMonthKey() {

    return `${getHistoryYear()}-${String(
        getHistoryMonth() + 1
    ).padStart(2, "0")}`;
}


function isHistoryFutureMonth() {

    const today = new Date();

    return (
        historyDate.getFullYear() > today.getFullYear() ||
        (
            historyDate.getFullYear() === today.getFullYear() &&
            historyDate.getMonth() > today.getMonth()
        )
    );
}


/* ---------- DAY STATUS ---------- */

function getHistoryDayStatus(day) {

    const today = new Date();

    const year = getHistoryYear();
    const month = getHistoryMonth();

    const date = new Date(
        year,
        month,
        day
    );


    /* Future */

    if (date > today) {
        return "future";
    }


    /* No habits */

    if (appData.habits.length === 0) {
        return "missed";
    }


    let completed = 0;

    appData.habits.forEach(habit => {

        if (
            getHistoryHabitStatus(
                habit.id,
                day
            ) === "completed"
        ) {

            completed++;
        }
    });


    /* Perfect */

    if (
        completed === appData.habits.length
    ) {

        return "perfect";
    }


    /* Partial */

    if (completed > 0) {

        return "partial";
    }


    return "missed";
}


/* ---------- HABIT STATUS FOR HISTORY ---------- */

function getHistoryHabitStatus(
    habitId,
    day
) {

    const monthKey =
        getHistoryMonthKey();

    const monthData =
        appData.months[monthKey];


    if (
        monthData &&
        monthData.habits &&
        monthData.habits[habitId] &&
        monthData.habits[habitId][day]
    ) {

        return monthData.habits[habitId][day];
    }


    const today = new Date();

    const selectedDateForDay =
        new Date(
            getHistoryYear(),
            getHistoryMonth(),
            day
        );


    if (selectedDateForDay < today) {

        return "missed";
    }


    return "pending";
}


/* ---------- RENDER HISTORY ---------- */

function renderHistoryPage() {

    const year =
        getHistoryYear();

    const month =
        getHistoryMonth();

    const days =
        getDaysInMonth(
            year,
            month
        );


    const monthName =
        historyDate.toLocaleString(
            "en-US",
            {
                month: "long"
            }
        );


    document.getElementById(
        "historyMonthTitle"
    ).textContent =
        `${monthName} ${year}`;


    document.getElementById(
        "historyMonthName"
    ).textContent =
        `${monthName} ${year}`;


    document.getElementById(
        "historyMonthDays"
    ).textContent =
        `${days} days`;


    const calendar =
        document.getElementById(
            "historyCalendar"
        );


    calendar.innerHTML = "";


    /* ---------- FIRST DAY ---------- */

    let firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    /*
       JS:
       Sunday = 0
       Monday = 1

       Our calendar starts Monday.
    */

    firstDay =
        firstDay === 0
            ? 6
            : firstDay - 1;


    /* ---------- EMPTY CELLS ---------- */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "history-day empty";

        calendar.appendChild(empty);
    }


    /* ---------- DAYS ---------- */

    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const dayButton =
            document.createElement("button");

        dayButton.className =
            "history-day";


        const status =
            getHistoryDayStatus(day);


        dayButton.classList.add(status);


        /* Today */

        const today =
            new Date();

        if (
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
        ) {

            dayButton.classList.add("today");
        }


        const number =
            document.createElement("span");

        number.className =
            "history-day-number";

        number.textContent =
            day;


        const statusDot =
            document.createElement("span");

        statusDot.className =
            "history-day-status";


        dayButton.appendChild(number);
        dayButton.appendChild(statusDot);


        /* Future days cannot be opened */

        if (status !== "future") {

            dayButton.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".history-day"
                        )
                        .forEach(item =>
                            item.classList.remove(
                                "selected"
                            )
                        );

                    dayButton.classList.add(
                        "selected"
                    );

                    renderHistoryDay(day);
                }
            );

        } else {

            dayButton.disabled = true;
        }


        calendar.appendChild(dayButton);
    }


    /* ---------- MONTH NAVIGATION ---------- */

    const nextButton =
        document.getElementById(
            "historyNextMonth"
        );

    if (nextButton) {

        nextButton.disabled =
            isHistoryFutureMonth();

        nextButton.style.opacity =
            isHistoryFutureMonth()
                ? "0.35"
                : "1";
    }
}


/* =====================================================
   HISTORY DAY DETAILS
   ===================================================== */

function renderHistoryDay(day) {

    const container =
        document.getElementById(
            "historyDayCard"
        );


    const year =
        getHistoryYear();

    const month =
        getHistoryMonth();

    const monthKey =
        getHistoryMonthKey();


    const monthData =
        appData.months[monthKey] || {
            habits: {},
            sleep: {},
            moods: {},
            notes: {}
        };


    const date =
        new Date(
            year,
            month,
            day
        );


    const dateText =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    /* ---------- HABITS ---------- */

    let completed = 0;

    const habitRows =
        appData.habits.map(habit => {

            const status =
                getHistoryHabitStatus(
                    habit.id,
                    day
                );


            if (
                status === "completed"
            ) {

                completed++;
            }


            return `
                <div class="history-habit-row">

                    <span class="history-habit-name">

                        ${habit.emoji}
                        ${escapeHTML(habit.name)}

                    </span>


                    <span
                        class="history-habit-status ${status}">

                        ${
                            status === "completed"
                                ? "✓"
                                : "×"
                        }

                    </span>

                </div>
            `;
        })
        .join("");


    const totalHabits =
        appData.habits.length;


    /* ---------- SLEEP ---------- */

    const sleep =
        monthData.sleep &&
        monthData.sleep[day]
            ? monthData.sleep[day]
            : "Not recorded";


    let sleepText = sleep;

    if (sleep === "9+") {
        sleepText = "9+ hrs";
    } else if (sleep === "<5") {
        sleepText = "< 5 hrs";
    } else if (
        sleep !== "Not recorded"
    ) {
        sleepText =
            `${sleep} hrs`;
    }


    /* ---------- MOOD ---------- */

    const mood =
        monthData.moods &&
        monthData.moods[day]
            ? monthData.moods[day]
            : "Not recorded";


    const moodEmoji = {

        terrible: "😞",

        bad: "🙁",

        okay: "😐",

        good: "🙂",

        amazing: "🥰"

    };


    const moodText =
        mood === "Not recorded"
            ? "Not recorded"
            : `${moodEmoji[mood] || ""} ${mood}`;


    /* ---------- NOTES ---------- */

    const note =
        monthData.notes &&
        monthData.notes[day]
            ? monthData.notes[day]
            : "";


    /* ---------- RENDER ---------- */

    container.innerHTML = `

        <div class="history-details-header">

            <div class="history-details-date">
                ${dateText}
            </div>

            <div class="history-details-score">

                <strong>
                    ${completed} / ${totalHabits}
                </strong>

                <small>
                    HABITS DONE
                </small>

            </div>

        </div>


        <div class="history-habits">

            ${
                totalHabits === 0

                    ? `
                        <p style="opacity:.6;font-size:12px;">
                            No habits were added.
                        </p>
                    `

                    : habitRows
            }

        </div>


        <div class="history-extra-grid">

            <div class="history-extra">

                <small>🌙 SLEEP</small>

                <strong>
                    ${sleepText}
                </strong>

            </div>


            <div class="history-extra">

                <small>♡ MOOD</small>

                <strong>
                    ${moodText}
                </strong>

            </div>

        </div>


        ${
            note

                ? `
                    <div class="history-note">

                        <small>✎ NOTE</small>

                        <p>
                            ${escapeHTML(note)}
                        </p>

                    </div>
                `

                : ""
        }

    `;
}


/* ---------- PREVIOUS MONTH ---------- */

function goToPreviousHistoryMonth() {

    historyDate =
        new Date(
            getHistoryYear(),
            getHistoryMonth() - 1,
            1
        );

    renderHistoryPage();
}


/* ---------- NEXT MONTH ---------- */

function historyNextMonth() {

    if (isHistoryFutureMonth()) {
        return;
    }


    const next =
        new Date(
            getHistoryYear(),
            getHistoryMonth() + 1,
            1
        );


    const today =
        new Date();


    /*
       Future month prevent
    */

    if (
        next.getFullYear() > today.getFullYear() ||
        (
            next.getFullYear() === today.getFullYear() &&
            next.getMonth() > today.getMonth()
        )
    ) {

        return;
    }


    historyDate = next;

    renderHistoryPage();
}

/* =====================================================
   21. EVENT LISTENERS
   ===================================================== */

function setupEvents() {

    // Add Habit button
    const addHabitButton =
        document.getElementById("addHabitButton");

    if (addHabitButton) {
        addHabitButton.addEventListener(
            "click",
            openHabitModal
        );
    }


    // Empty state Add Habit button
    const emptyAddHabitButton =
        document.getElementById("emptyAddHabitButton");

    if (emptyAddHabitButton) {
        emptyAddHabitButton.addEventListener(
            "click",
            openHabitModal
        );
    }


    // Close modal
    const closeButton =
        document.getElementById("closeHabitModal");

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeHabitModal
        );
    }


    // Save habit
    const saveButton =
        document.getElementById("saveHabitButton");

    if (saveButton) {
        saveButton.addEventListener(
            "click",
            addHabit
        );
    }


    // Sleep selector

const sleepSelect =
    document.getElementById("sleepSelect");

if (sleepSelect) {

    sleepSelect.addEventListener(
        "change",
        () => {

            const today = getToday();

            const selectedSleep =
                sleepSelect.value;

            if (!selectedSleep) {
                return;
            }

            getMonthData().sleep[today.day] =
                selectedSleep;

            saveData();

            renderSleepTable();

            updateTodaySummary();
        }
    );
}

    // Daily notes
    const notes =
        document.getElementById("dailyNotes");

    if (notes) {
        notes.addEventListener(
            "input",
            saveNotes
        );
    }


    // Theme
    const themeButton =
        document.getElementById("themeButton");

    if (themeButton) {
        themeButton.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-mode"
                );

            }
        );
    }

   // Mood buttons
   setupMoodButtons();

   // Hamburger Menu

const menuButton =
    document.getElementById("menuButton");

const mobileMenu =
    document.getElementById("mobileMenu");


if (menuButton && mobileMenu) {

    menuButton.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle("open");

        }
    );


    mobileMenu
        .querySelectorAll("button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const targetId =
                        button.dataset.target;

                    const target =
                        document.getElementById(targetId);

                    if (target) {
                        target.click();
                    }

                    mobileMenu.classList.remove("open");

                }
            );

        });

}

// Home tab

const homeTab =
    document.getElementById(
        "homeTab"
    );


if (homeTab) {

    homeTab.addEventListener(
        "click",
        () => {

            document.body.classList.remove(
                "progress-view"
            );

            document.body.classList.remove(
                "settings-view"
            );

            document.body.classList.remove(
                "history-view"
            )

            homeTab.classList.add("active");

            document.getElementById("settingsTab")
                    .classList.remove("active");

            document.getElementById("progressTab")
                    .classList.remove("active");

            document.getElementById("historyTab")
                    .classList.remove("active");        

            renderAll();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}   

   // Progress tab

const progressTab =
    document.getElementById(
        "progressTab"
    );


if (progressTab) {

    progressTab.addEventListener(
        "click",
        () => {

            document.body.classList.remove(
                "history-view"
            );

            document.body.classList.add(
                "progress-view"
            );

            document.body.classList.remove(
                "settings-view"
            );

            progressTab.classList.add("active");

            document.getElementById("homeTab")
                     .classList.remove("active");

              document.getElementById("settingsTab")
                    .classList.remove("active");

                    

            document.getElementById("historyTab")
                    .classList.remove("active");         

            renderProgressPage();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}

// ================= SETTINGS =================

const settingsTab =
    document.getElementById("settingsTab");

const darkModeOption =
    document.getElementById("darkModeOption");

const lightModeOption =
    document.getElementById("lightModeOption");

const clearDataButton =
    document.getElementById("clearDataButton");


// Settings tab

if (settingsTab) {

    settingsTab.addEventListener(
        "click",
        () => {

            document.body.classList.remove(
                "progress-view",
                "history-view"
            );

            document.body.classList.add(
                "settings-view"
            );

            document.getElementById("homeTab")
                     .classList.remove("active");

            document.getElementById("progressTab")
                    .classList.remove("active");         

            document.getElementById("historyTab")
                    .classList.remove("active") 

            settingsTab.classList.add("active");        

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );

       
}


// Dark mode

if (darkModeOption) {

    darkModeOption.addEventListener(
        "click",
        () => {

            document.body.classList.remove(
                "light-mode"
            );

            appData.theme = "dark";

            saveData();

            darkModeOption.classList.add("active");
            lightModeOption.classList.remove("active");
        }
    );
}


// Light mode

if (lightModeOption) {

    lightModeOption.addEventListener(
        "click",
        () => {

            document.body.classList.add(
                "light-mode"
            );

            appData.theme = "light";

            saveData();

            lightModeOption.classList.add("active");
            darkModeOption.classList.remove("active");
        }
    );
}


// Clear all progress

if (clearDataButton) {

    clearDataButton.addEventListener(
        "click",
        () => {

            const confirmClear =
                confirm(
                    "Are you sure you want to clear all your progress?"
                );

            if (!confirmClear) {
                return;
            }

            localStorage.removeItem(
                CONFIG.storageKey
            );

            appData = createEmptyData();

            saveData();

            document.body.classList.remove(
                "light-mode"
            );

            document.body.classList.remove(
                "settings-view"
            );

            renderAll();

            alert(
                "All progress has been cleared. ✨"
            );
        }
    );
}



// History tab

   const historyTab =
       document.getElementById(
           "historyTab"
       );


   if (historyTab) {

       historyTab.addEventListener(
           "click",
           () => {

               document.body.classList.remove(
                   "progress-view"
               );

               document.body.classList.add(
                   "history-view"
               );


               historyTab.classList.add(
                   "active"
               );


               document.getElementById("settingsTab")
                       .classList.remove("active");


               document.getElementById(
                   "homeTab"
               ).classList.remove(
                   "active"
               );


               document.getElementById(
                   "progressTab"
               ).classList.remove(
                   "active"
               );


               renderHistoryPage();


               window.scrollTo({
                   top: 0,
                   behavior: "smooth"
               });

           }
       );

   }


   // History previous month

   const historyPreviousMonth =
       document.getElementById(
           "historyPreviousMonth"
       );


   if (historyPreviousMonth) {

       historyPreviousMonth.addEventListener(
           "click",
           goToPreviousHistoryMonth
       );

   }


   // History next month

   const historyNextMonthButton =
       document.getElementById(
           "historyNextMonth"
       );


   if (historyNextMonthButton) {

       historyNextMonthButton.addEventListener(
           "click",
           historyNextMonth
       );

   }

   // Settings - Appearance
     


    function updateAppearanceButtons() {

        if (
            document.body.classList.contains(
                "light-mode"
            )
        ) {

            lightModeOption.classList.add("active");
            darkModeOption.classList.remove("active");

        } else {

            darkModeOption.classList.add("active");
            lightModeOption.classList.remove("active");
        }
    }

    updateAppearanceButtons();

// Settings - Week Start

    const mondayOption =
        document.getElementById("mondayOption");

    const sundayOption =
        document.getElementById("sundayOption");


    if (mondayOption) {

        mondayOption.addEventListener(
            "click",
            () => {

                mondayOption.classList.add("active");
                sundayOption.classList.remove("active");

                CONFIG.firstDayOfWeek = 1;
            }
        );
    }


    if (sundayOption) {

        sundayOption.addEventListener(
            "click",
            () => {

                sundayOption.classList.add("active");
                mondayOption.classList.remove("active");

                CONFIG.firstDayOfWeek = 0;
            }
        );
    }    
   
}


/* =====================================================
   22. ESCAPE HTML
   ===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =====================================================
   23. RENDER EVERYTHING
   ===================================================== */

function renderAll() {

    renderMonthInfo();

    renderHabitTable();

    renderSleepTable();

    renderMood();

    loadNotes();

    updateTodaySummary();

    renderProgressPage();
}


/* =====================================================
   24. START APP
   ===================================================== */

function init() {

    resetToCurrentMonth();
    
    resetHistoryToCurrentMonth();

    setupEvents();

    renderAll();
}


/* Start */

init();