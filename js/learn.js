/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   learn.js
   Stage B:
   - Lesson display
   - Hindi → English examples
   - Lesson completion
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

    },


    2: {

        title: "Everyday Conversations",

        description:
            "Learn useful English sentences for daily situations.",

        examples: [

            {
                hindi: "आप कहाँ जा रहे हैं?",
                english: "Where are you going?"
            },

            {
                hindi: "मैं घर जा रहा हूँ।",
                english: "I am going home."
            },

            {
                hindi: "क्या आप मेरी मदद कर सकते हैं?",
                english: "Can you help me?"
            },

            {
                hindi: "मुझे समझ नहीं आया।",
                english: "I did not understand."
            },

            {
                hindi: "कृपया धीरे बोलिए।",
                english: "Please speak slowly."
            }

        ]

    }

};

    /* ==========================================
       GET LESSON LIST
    ========================================== */

    function getLessonList() {

        return document.getElementById(
            "lessonList"
        );

    }


    /* ==========================================
       SHOW LESSON LIST
    ========================================== */

    function showLessonList() {

    const container =
        getLessonList();


    if (!container) {

        console.error(
            "Learn error: lessonList not found."
        );

        return;

    }


    let lessonsHTML = "";


    Object.keys(lessons).forEach(
        function (lessonId) {

            const lesson =
                lessons[lessonId];


            let completed = false;


            if (
                typeof EBStorage !== "undefined" &&
                typeof EBStorage.isLessonCompleted ===
                "function"
            ) {

                completed =
                    EBStorage.isLessonCompleted(
                        Number(lessonId)
                    );

            }


            lessonsHTML += `

                <div class="lessonCard">

                    <span class="lessonNumber">
                        Lesson ${lessonId}
                    </span>

                    <h3>
                        ${lesson.title}
                    </h3>

                    <p>
                        ${lesson.description}
                    </p>

                    <button
                        class="primaryButton lessonButton"
                        data-lesson="${lessonId}"
                        ${
                            completed
                                ? "disabled"
                                : ""
                        }
                    >
                        ${
                            completed
                                ? "✅ Lesson Completed"
                                : "Start Lesson"
                        }
                    </button>

                </div>

            `;

        }
    );


    container.innerHTML =
        lessonsHTML;


    const buttons =
        container.querySelectorAll(
            ".lessonButton"
        );


    buttons.forEach(
        function (button) {

            if (button.disabled) {

                return;

            }


            button.addEventListener(
                "click",
                function () {

                    const lessonId =
                        Number(
                            button.dataset.lesson
                        );


                    openLesson(
                        lessonId
                    );

                }
            );

        }
    );

}

    /* ==========================================
       OPEN LESSON
    ========================================== */

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


        /* --------------------------------------
           Check completion status
        -------------------------------------- */

        let isCompleted = false;


        if (
            typeof EBStorage !== "undefined" &&
            typeof EBStorage.isLessonCompleted === "function"
        ) {

            isCompleted =
                EBStorage.isLessonCompleted(
                    lessonId
                );

        }


        /* --------------------------------------
           Build examples
        -------------------------------------- */

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


        /* --------------------------------------
           Completion button
        -------------------------------------- */

        const completionButton =
            isCompleted

                ? `
                    <button
                        id="completeLesson"
                        class="primaryButton"
                        disabled
                    >
                        ✅ Lesson Completed
                    </button>
                  `

                : `
                    <button
                        id="completeLesson"
                        class="primaryButton"
                    >
                        ✅ Complete Lesson
                    </button>
                  `;


        const completionMessage =
            isCompleted

                ? `
                    <div
                        id="completionMessage"
                        class="speechStatus"
                    >
                        🎉 You have completed this lesson!
                    </div>
                  `

                : `
                    <div
                        id="completionMessage"
                        class="speechStatus"
                        style="display:none;"
                    >
                    </div>
                  `;


        /* --------------------------------------
           Render lesson
        -------------------------------------- */

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


                ${completionMessage}


                ${completionButton}


                <button
                    id="backToLessons"
                    class="secondaryButton"
                >
                    ← Back to Lessons
                </button>

            </div>

        `;


        /* ======================================
           COMPLETE LESSON
        ====================================== */

        const completeButton =
            document.getElementById(
                "completeLesson"
            );


        if (
            completeButton &&
            !isCompleted
        ) {

            completeButton.addEventListener(
                "click",
                function () {

                    if (
                        typeof EBStorage === "undefined" ||
                        typeof EBStorage.markLessonCompleted !==
                        "function"
                    ) {

                        console.error(
                            "Learn error: storage service unavailable."
                        );

                        return;

                    }

                    /* ------------------------------
                       Save completion
                    ------------------------------ */

                    EBStorage.markLessonCompleted(
                        lessonId
                    );
/* ------------------------------
   Update daily streak
------------------------------ */

if (
    typeof EBStorage.updateDailyStreak ===
    "function"
) {

    EBStorage.updateDailyStreak();

}
                   
/* ------------------------------
   Award XP
------------------------------ */

let earnedXP = 0;

if (
    typeof EBStorage.addXP === "function"
) {

    const previousXP =
        EBStorage.getXP();

    const newXP =
        EBStorage.addXP(20);

    earnedXP =
        newXP - previousXP;

}
                   /* ------------------------------
   Sync level
------------------------------ */

if (
    typeof EBStorage.syncLevel === "function"
) {

    EBStorage.syncLevel();

}
                   
   /* ------------------------------
   Update lesson progress
------------------------------ */

const totalLessons =
    Object.keys(lessons).length;


const completedLessonIds =
    EBStorage.getCompletedLessons();


const validCompletedLessons =
    [...new Set(completedLessonIds)]
        .filter(function (lessonId) {

            return lessons[lessonId] !== undefined;

        });


const progress =
    totalLessons > 0
        ? Math.min(
            100,
            Math.round(
                (validCompletedLessons.length /
                totalLessons) * 100
            )
        )
        : 0;


EBStorage.saveProgress(
    progress
);
                   
                    /* ------------------------------
                       Update button
                    ------------------------------ */

                    completeButton.textContent =
                        "✅ Lesson Completed";

                    completeButton.disabled = true;


                    /* ------------------------------
                       Show completion message
                    ------------------------------ */

                    const message =
                        document.getElementById(
                            "completionMessage"
                        );


                    if (message) {

                        message.textContent =
    "🎉 Lesson completed! +" +
    earnedXP +
    " XP earned!";
                        message.style.display =
                            "block";

                    }


                    console.log(
                        "Lesson completed:",
                        lessonId
                    );

                }
            );

        }


        /* ======================================
           BACK TO LESSON LIST
        ====================================== */

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


        /* ======================================
           SCROLL TO TOP
        ====================================== */

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    /* ==========================================
       INITIALIZE LEARN MODULE
    ========================================== */

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
    ========================================== */

    window.EBLearn = {

        initialize:
            initializeLearn,

        openLesson:
            openLesson,

        showLessonList:
            showLessonList

    };


})();
