/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   app.js
   Responsibility:
   - Application navigation only
========================================== */

(function () {

    "use strict";


    /* ==========================================
       PAGE NAVIGATION
    =========================================== */

    function showPage(pageName) {

        const pages = document.querySelectorAll(".page");
        const navButtons = document.querySelectorAll(".navButton");


        /* --------------------------------------
           Hide all pages
        -------------------------------------- */

        pages.forEach(function (page) {

            page.style.display = "none";

            page.classList.remove("active");

        });


        /* --------------------------------------
           Show selected page
        -------------------------------------- */

        const selectedPage =
            document.getElementById("page-" + pageName);


        if (!selectedPage) {

            console.error(
                "Navigation error: page not found:",
                pageName
            );

            return;

        }


        selectedPage.style.display = "block";

        selectedPage.classList.add("active");


        /* --------------------------------------
           Update navigation button
        -------------------------------------- */

        navButtons.forEach(function (button) {

            button.classList.remove("active");

        });


        navButtons.forEach(function (button) {

            if (button.dataset.page === pageName) {

                button.classList.add("active");

            }

        });


        /* --------------------------------------
           Scroll to top
        -------------------------------------- */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ==========================================
       NAVIGATION EVENTS
    =========================================== */

    function initializeNavigation() {

        const pageButtons =
            document.querySelectorAll("[data-page]");


        pageButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const pageName =
                        button.dataset.page;


                    if (!pageName) {

                        return;

                    }


                    showPage(pageName);

                }
            );

        });


        /* --------------------------------------
           Initial page
        -------------------------------------- */

        showPage("home");

    }
   
/* ==========================================
   HOME XP DISPLAY
========================================== */

function updateHomeXP() {

    const xpElement =
        document.getElementById("homeXP");


    if (!xpElement) {

        console.warn(
            "Home XP element not found."
        );

        return;

    }


    if (
        typeof EBStorage === "undefined" ||
        typeof EBStorage.getXP !== "function"
    ) {

        console.warn(
            "Storage XP service unavailable."
        );

        return;

    }


    const currentXP =
        EBStorage.getXP();


    xpElement.textContent =
        currentXP;

}
/* ==========================================
   HOME PROGRESS DISPLAY
========================================== */

function updateHomeProgress() {

    const progressElement =
        document.getElementById("homeProgress");


    if (!progressElement) {

        console.warn(
            "Home Progress element not found."
        );

        return;

    }


    if (
        typeof EBStorage === "undefined" ||
        typeof EBStorage.getCompletedLessons !==
        "function" ||
        typeof EBStorage.saveProgress !==
        "function"
    ) {

        console.warn(
            "Storage Progress service unavailable."
        );

        return;

    }


    /* --------------------------------------
       Current total lessons
    -------------------------------------- */

    const totalLessons =
    typeof EBLessonEngine !== "undefined" &&
    typeof EBLessonEngine.getTotal === "function"

        ? EBLessonEngine.getTotal()

        : 0;


    /* --------------------------------------
       Completed lessons
    -------------------------------------- */

const completedLessonIds =
    EBStorage.getCompletedLessons();


const validCompletedLessons =
    [...new Set(completedLessonIds)]
        .filter(function (lessonId) {

            return Number(lessonId) >= 1 &&
                Number(lessonId) <= totalLessons;

        });


const currentProgress =
    totalLessons > 0
        ? Math.min(
            100,
            Math.round(
                (validCompletedLessons.length /
                totalLessons) * 100
            )
        )
        : 0;


    /* --------------------------------------
       Save synchronized progress
    -------------------------------------- */

    EBStorage.saveProgress(
        currentProgress
    );


    /* --------------------------------------
       Update Home UI
    -------------------------------------- */

    progressElement.textContent =
        currentProgress + "%";

}   
    /* ==========================================
       APP START
    =========================================== */

    document.addEventListener(
    "DOMContentLoaded",
    function () {

initializeNavigation();

updateHomeXP();

updateHomeLevel();

updateHomeProgress();

updateHomeStreak();
       
/* ==========================================
   HOME LEVEL DISPLAY
========================================== */

function updateHomeLevel() {

    const levelElement =
        document.getElementById("homeLevel");


    if (!levelElement) {

        console.warn(
            "Home Level element not found."
        );

        return;

    }


    if (
        typeof EBStorage === "undefined" ||
        typeof EBStorage.syncLevel !== "function"
    ) {

        console.warn(
            "Storage Level service unavailable."
        );

        return;

    }


    const currentLevel =
        EBStorage.syncLevel();


    levelElement.textContent =
        currentLevel;

}
       /* ==========================================
   HOME STREAK DISPLAY
========================================== */

function updateHomeStreak() {

    const streakElement =
        document.getElementById("homeStreak");


    if (!streakElement) {

        console.warn(
            "Home Streak element not found."
        );

        return;

    }


    if (
        typeof EBStorage === "undefined" ||
        typeof EBStorage.getStreak !== "function"
    ) {

        console.warn(
            "Storage Streak service unavailable."
        );

        return;

    }


    const currentStreak =
        EBStorage.getStreak();


    streakElement.textContent =
        currentStreak;

}
       
        /* --------------------------------------
           Initialize Learn Module
        -------------------------------------- */

        if (
            typeof EBLearn !== "undefined" &&
            typeof EBLearn.initialize === "function"
        ) {

            EBLearn.initialize();

        }


        console.log(
            "English Buddy Pro: App initialized successfully."
        );

    }
);


})();
