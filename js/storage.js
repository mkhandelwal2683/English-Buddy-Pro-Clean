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

        PROGRESS: "ebp_progress",

        COMPLETED_LESSONS: "ebp_completed_lessons"

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
    =========================================== */

    function getLevel() {

        return load(KEYS.LEVEL, 1);

    }


    function saveLevel(level) {

        return save(KEYS.LEVEL, level);

    }


    /* ==========================================
       STREAK
    =========================================== */

    function getStreak() {

        return load(KEYS.STREAK, 0);

    }


    function saveStreak(streak) {

        return save(KEYS.STREAK, streak);

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

        getStreak: getStreak,

        saveStreak: saveStreak,

        getProgress: getProgress,

        saveProgress: saveProgress,

        getCompletedLessons:
            getCompletedLessons,

        saveCompletedLessons:
            saveCompletedLessons,

        markLessonCompleted:
            markLessonCompleted,

        isLessonCompleted:
            isLessonCompleted

    };


    /* ==========================================
       INITIALIZATION
    =========================================== */

    console.log(
        "English Buddy Pro: Storage initialized."
    );

})();
