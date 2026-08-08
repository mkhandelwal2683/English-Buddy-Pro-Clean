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
       APP START
    =========================================== */

    document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeNavigation();


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
