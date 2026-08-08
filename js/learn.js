/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   learn.js
   Stage A:
   - Lesson display
   - Hindi → English examples
========================================== */

(function () {

    "use strict";


    /* ==========================================
       LESSON DATA
    =========================================== */

    const lessons = {

        1: {

            title: "Daily English Basics",

            description:
                "Learn simple English sentences for everyday conversations.",

            examples: [

                {
                    hindi: "मैं ठीक हूँ।",
                    english: "I am fine."
                },

                {
                    hindi: "आप कैसे हैं?",
                    english: "How are you?"
                },

                {
                    hindi: "मेरा नाम राहुल है।",
                    english: "My name is Rahul."
                },

                {
                    hindi: "मुझे पानी चाहिए।",
                    english: "I want water."
                },

                {
                    hindi: "धन्यवाद।",
                    english: "Thank you."
                }

            ]

        }

    };


    /* ==========================================
       GET ELEMENTS
    =========================================== */

    function getLessonList() {

        return document.getElementById(
            "lessonList"
        );

    }


    /* ==========================================
       SHOW LESSON LIST
    =========================================== */

    function showLessonList() {

        const container =
            getLessonList();


        if (!container) {

            console.error(
                "Learn error: lessonList not found."
            );

            return;

        }


        container.innerHTML = `

            <div class="lessonCard">

                <span class="lessonNumber">
                    Lesson 1
                </span>

                <h3>
                    ${lessons[1].title}
                </h3>

                <p>
                    ${lessons[1].description}
                </p>

                <button
                    class="primaryButton lessonButton"
                    data-lesson="1"
                >
                    Start Lesson
                </button>

            </div>

        `;


        const button =
            container.querySelector(
                ".lessonButton"
            );


        if (button) {

            button.addEventListener(
                "click",
                function () {

                    openLesson(1);

                }
            );

        }

    }


    /* ==========================================
       OPEN LESSON
    =========================================== */

    function openLesson(lessonId) {

        const lesson =
            lessons[lessonId];


        if (!lesson) {

            console.error(
                "Learn error: lesson not found.",
                lessonId
            );

            return;

        }


        const container =
            getLessonList();


        if (!container) {

            return;

        }


        let examplesHTML = "";


        lesson.examples.forEach(
            function (example, index) {

                examplesHTML += `

                    <div class="exampleCard">

                        <div class="exampleNumber">
                            Example ${index + 1}
                        </div>

                        <div class="hindiText">
                            ${example.hindi}
                        </div>

                        <div class="englishText">
                            ${example.english}
                        </div>

                    </div>

                `;

            }
        );


        container.innerHTML = `

            <div class="lessonCard lessonContent">

                <span class="lessonNumber">
                    Lesson ${lessonId}
                </span>

                <h3>
                    ${lesson.title}
                </h3>

                <p>
                    ${lesson.description}
                </p>


                <div class="examplesSection">

                    <h3>
                        Hindi → English
                    </h3>

                    ${examplesHTML}

                </div>


                <button
                    id="backToLessons"
                    class="secondaryButton"
                >
                    ← Back to Lessons
                </button>

            </div>

        `;


        const backButton =
            document.getElementById(
                "backToLessons"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                function () {

                    showLessonList();

                }
            );

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ==========================================
       INITIALIZE LEARN MODULE
    =========================================== */

    function initializeLearn() {

        const container =
            getLessonList();


        if (!container) {

            console.error(
                "Learn error: lessonList not found."
            );

            return;

        }


        showLessonList();


        console.log(
            "English Buddy Pro: Learn module initialized."
        );

    }


    /* ==========================================
       PUBLIC API
    =========================================== */

    window.EBLearn = {

        initialize: initializeLearn,

        openLesson: openLesson,

        showLessonList: showLessonList

    };


})();
