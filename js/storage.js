/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   storage.js
   Responsibility:
   - Safe browser localStorage access
   - Store and retrieve application data
========================================== */

(function () {

    "use strict";


    /* ==========================================
       STORAGE KEYS
    =========================================== */

    const KEYS = {

        XP: "ebp_xp",

        LEVEL: "ebp_level",

        STREAK: "ebp_streak",

      LAST_ACTIVITY_DATE: "ebp_last_activity_date",
       
        PROGRESS: "ebp_progress",

        COMPLETED_LESSONS: "ebp_completed_lessons"

       GENERATED_LESSONS:
    "ebp_generated_lessons"
   
    };


    /* ==========================================
       SAFE SAVE
    =========================================== */

    function save(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            console.error(
                "Storage save failed:",
                error
            );

            return false;

        }

    }


    /* ==========================================
       SAFE LOAD
    =========================================== */

    function load(key, defaultValue = null) {

        try {

            const storedValue =
                localStorage.getItem(key);


            if (storedValue === null) {

                return defaultValue;

            }


            return JSON.parse(storedValue);

        } catch (error) {

            console.error(
                "Storage load failed:",
                error
            );

            return defaultValue;

        }

    }


    /* ==========================================
       REMOVE VALUE
    =========================================== */

    function remove(key) {

        try {

            localStorage.removeItem(key);

            return true;

        } catch (error) {

            console.error(
                "Storage remove failed:",
                error
            );

            return false;

        }

    }


    /* ==========================================
       CLEAR APP DATA
    =========================================== */

    function clearAll() {

        try {

            Object.values(KEYS).forEach(
                function (key) {

                    localStorage.removeItem(key);

                }
            );

            return true;

        } catch (error) {

            console.error(
                "Storage clear failed:",
                error
            );

            return false;

        }

    }


    /* ==========================================
   XP
========================================== */

function getXP() {

    return load(KEYS.XP, 0);

}


function saveXP(xp) {

    return save(KEYS.XP, xp);

}


function addXP(amount) {

    if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        console.error(
            "Storage XP error: invalid XP amount.",
            amount
        );

        return getXP();

    }


    const currentXP =
        getXP();


    const newXP =
        currentXP + amount;


    saveXP(newXP);


    return newXP;

}


    /* ==========================================
   LEVEL
========================================== */

function getLevel() {

    return load(KEYS.LEVEL, 1);

}


function saveLevel(level) {

    return save(KEYS.LEVEL, level);

}


function calculateLevel(xp) {

    if (
        typeof xp !== "number" ||
        !Number.isFinite(xp) ||
        xp < 0
    ) {

        return 1;

    }


    return Math.floor(xp / 100) + 1;

}


function syncLevel() {

    const currentXP =
        getXP();


    const currentLevel =
        calculateLevel(currentXP);


    saveLevel(currentLevel);


    return currentLevel;

}


    /* ==========================================
   STREAK
========================================== */

function getStreak() {

    return load(KEYS.STREAK, 0);

}


function saveStreak(streak) {

    return save(KEYS.STREAK, streak);

}


function getLastActivityDate() {

    return load(
        KEYS.LAST_ACTIVITY_DATE,
        null
    );

}


function saveLastActivityDate(date) {

    return save(
        KEYS.LAST_ACTIVITY_DATE,
        date
    );

}


function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


function updateDailyStreak() {

    const today =
        getTodayDate();


    const lastActivityDate =
        getLastActivityDate();


    let currentStreak =
        getStreak();


    /* --------------------------------------
       First activity
    -------------------------------------- */

    if (!lastActivityDate) {

        currentStreak = 1;

    }

    /* --------------------------------------
       Activity on same day
    -------------------------------------- */

    else if (
        lastActivityDate === today
    ) {

        return currentStreak;

    }

    /* --------------------------------------
       Compare with yesterday
    -------------------------------------- */

    else {

        const yesterday =
            new Date();


        yesterday.setDate(
            yesterday.getDate() - 1
        );


        const yesterdayYear =
            yesterday.getFullYear();


        const yesterdayMonth =
            String(
                yesterday.getMonth() + 1
            ).padStart(2, "0");


        const yesterdayDay =
            String(
                yesterday.getDate()
            ).padStart(2, "0");


        const yesterdayDate =
            yesterdayYear +
            "-" +
            yesterdayMonth +
            "-" +
            yesterdayDay;


        if (
            lastActivityDate ===
            yesterdayDate
        ) {

            currentStreak += 1;

        } else {

            currentStreak = 1;

        }

    }


    saveStreak(
        currentStreak
    );


    saveLastActivityDate(
        today
    );


    return currentStreak;

}


    /* ==========================================
       PROGRESS
    =========================================== */

    function getProgress() {

        return load(KEYS.PROGRESS, 0);

    }


    function saveProgress(progress) {

        return save(KEYS.PROGRESS, progress);

    }


    /* ==========================================
       COMPLETED LESSONS
    =========================================== */

    function getCompletedLessons() {

        return load(
            KEYS.COMPLETED_LESSONS,
            []
        );

    }


    function saveCompletedLessons(lessons) {

        return save(
            KEYS.COMPLETED_LESSONS,
            lessons
        );

    }


    function markLessonCompleted(lessonId) {

        const lessons =
            getCompletedLessons();


        if (!lessons.includes(lessonId)) {

            lessons.push(lessonId);

            saveCompletedLessons(lessons);

        }


        return lessons;

    }


    function isLessonCompleted(lessonId) {

        const lessons =
            getCompletedLessons();


        return lessons.includes(lessonId);

    }

/* ==========================================
   GENERATED LESSONS
========================================== */

function getGeneratedLessons() {

    return load(
        KEYS.GENERATED_LESSONS,
        {}
    );

}


function saveGeneratedLessons(lessons) {

    if (
        !lessons ||
        typeof lessons !== "object" ||
        Array.isArray(lessons)
    ) {

        console.error(
            "Generated lessons error: invalid lesson data."
        );

        return false;

    }


    return save(
        KEYS.GENERATED_LESSONS,
        lessons
    );

}


function addGeneratedLesson(lesson) {

    if (
        !lesson ||
        typeof lesson !== "object" ||
        !lesson.id
    ) {

        console.error(
            "Generated lesson error: invalid lesson."
        );

        return false;

    }


    const lessons =
        getGeneratedLessons();


    lessons[
        lesson.id
    ] = lesson;


    return saveGeneratedLessons(
        lessons
    );

}


function removeGeneratedLesson(lessonId) {

    const lessons =
        getGeneratedLessons();


    if (
        lessons[lessonId] === undefined
    ) {

        return false;

    }


    delete lessons[lessonId];


    return saveGeneratedLessons(
        lessons
    );

}
   
    /* ==========================================
       PUBLIC API
    =========================================== */

    window.EBStorage = {

        KEYS: KEYS,

        save: save,

        load: load,

        remove: remove,

        clearAll: clearAll,

        getXP: getXP,

        saveXP: saveXP,

        addXP: addXP,
       
        getLevel: getLevel,

        saveLevel: saveLevel,

        calculateLevel: calculateLevel,

        syncLevel: syncLevel,
       
        getStreak: getStreak,

saveStreak: saveStreak,

getLastActivityDate: getLastActivityDate,

saveLastActivityDate: saveLastActivityDate,

getTodayDate: getTodayDate,

updateDailyStreak: updateDailyStreak,

        getProgress: getProgress,

        saveProgress: saveProgress,

        getCompletedLessons:
            getCompletedLessons,

        saveCompletedLessons:
            saveCompletedLessons,

        markLessonCompleted:
            markLessonCompleted,

        isLessonCompleted:
    isLessonCompleted,

getGeneratedLessons:
    getGeneratedLessons,

saveGeneratedLessons:
    saveGeneratedLessons,

addGeneratedLesson:
    addGeneratedLesson,

removeGeneratedLesson:
    removeGeneratedLesson

    };


    /* ==========================================
       INITIALIZATION
    =========================================== */

    console.log(
        "English Buddy Pro: Storage initialized."
    );

})();
