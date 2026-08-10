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
   LESSON DATA SOURCE
========================================== */

const lessons =
    typeof EBLessonEngine !== "undefined" &&
    typeof EBLessonEngine.getAll === "function"

        ? EBLessonEngine.getAll()

        : {};

    /* ==========================================
       GET LESSON LIST
    ========================================== */

    function getLessonList() {

        return document.getElementById(
            "lessonList"
        );

    }

/* ==========================================
   SHOW LEARN LANDING
========================================== */

function showLearnLanding() {

    const container =
        getLessonList();


    if (!container) {

        console.error(
            "Learn error: lessonList not found."
        );

        return;

    }


    container.innerHTML = `

        <div class="sectionCard">

            <h2>
                Start Your English Journey
            </h2>

            <p>
                Learn useful English sentences
                step by step.
            </p>

            <button
                id="openLessonLibrary"
                class="primaryButton"
            >
                📚 Start Learning
            </button>

        </div>

    `;


    const startButton =
        document.getElementById(
            "openLessonLibrary"
        );


    if (startButton) {

        startButton.addEventListener(
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
                    <button
    class="primaryButton lessonButton"
    data-lesson="${lessonId}"
>
    ${
        completed
            ? "📖 Review Lesson"
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
   Build practice activity
-------------------------------------- */

let practiceHTML = "";

if (
    Array.isArray(lesson.practice) &&
    lesson.practice.length > 0
)
 {

    practiceHTML = `

        <div
            class="practiceSection"
            id="practiceSection"
        >

            <h3>
                🎯 Practice English
            </h3>

            <p>
                Read the Hindi sentence and try to say
                the English sentence before revealing
                the answer.
            </p>

            <div
                class="practiceCard"
                id="practiceCard"
            >

                <div
                    class="practiceLabel"
                >
                    Practice 1 of ${lesson.practice.length}
                </div>

                <div
                    class="hindiText"
                    id="practiceHindi"
                >
                    ${lesson.practice[0].hindi}
                </div>

                <div
                    class="englishText"
                    id="practiceEnglish"
                    style="display:none;"
                >
                    ${lesson.practice[0].english}
                </div>

            </div>


            <button
                id="showPracticeAnswer"
                class="secondaryButton"
            >
                👀 Show Answer
            </button>


            <button
                id="nextPractice"
                class="primaryButton"
                style="display:none;"
            >
                Next Practice →
            </button>

        </div>

    `;

}

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

                   ${practiceHTML}
                   
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


const lessonXP =
    typeof lesson.xp === "number" &&
    lesson.xp > 0

        ? lesson.xp

        : 20;


if (
    typeof EBStorage.addXP === "function"
) {

    const previousXP =
        EBStorage.getXP();


    const newXP =
        EBStorage.addXP(
            lessonXP
        );


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
   PRACTICE ACTIVITY
====================================== */

let currentPracticeIndex = 0;


const showAnswerButton =
    document.getElementById(
        "showPracticeAnswer"
    );


const nextPracticeButton =
    document.getElementById(
        "nextPractice"
    );


const practiceHindi =
    document.getElementById(
        "practiceHindi"
    );


const practiceEnglish =
    document.getElementById(
        "practiceEnglish"
    );


const practiceCard =
    document.getElementById(
        "practiceCard"
    );


if (
    showAnswerButton &&
    nextPracticeButton &&
    practiceHindi &&
    practiceEnglish &&
    practiceCard
) {

    /* ----------------------------------
       SHOW ANSWER
    ---------------------------------- */

    showAnswerButton.addEventListener(
        "click",
        function () {

            practiceEnglish.style.display =
                "block";


            showAnswerButton.style.display =
                "none";


            nextPracticeButton.style.display =
                "inline-block";

        }
    );


    /* ----------------------------------
       NEXT PRACTICE
    ---------------------------------- */

    nextPracticeButton.addEventListener(
        "click",
        function () {

            currentPracticeIndex++;


            if (
                currentPracticeIndex >=
                lesson.practice.length
            ) {

                currentPracticeIndex = 0;

            }


            const practiceItem =
                lesson.practice[
    currentPracticeIndex
                ];


            practiceHindi.textContent =
                practiceItem.hindi;


            practiceEnglish.textContent =
                practiceItem.english;


            practiceEnglish.style.display =
                "none";


            showAnswerButton.style.display =
                "inline-block";


            if (
                currentPracticeIndex ===
                lesson.practice.length - 1
            ) {

                nextPracticeButton.textContent =
                    "🔄 Practice Again";

            } else {

                nextPracticeButton.textContent =
                    "Next Practice →";

            }


            nextPracticeButton.style.display =
                "none";


            const practiceLabel =
                practiceCard.querySelector(
                    ".practiceLabel"
                );


            if (practiceLabel) {

                practiceLabel.textContent =
                    "Practice " +
                    (currentPracticeIndex + 1) +
                    " of " +
                    lesson.practice.length;

            }

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


        showLearnLanding();


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

    showLearnLanding:
        showLearnLanding,

    openLesson:
        openLesson,

    showLessonList:
        showLessonList

};


})();
