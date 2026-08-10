/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   lesson-engine.js

   Responsibility:
   - Load lessons from available sources
   - Normalize lesson data
   - Provide one lesson API to the app
========================================== */

(function () {

    "use strict";


    /* ==========================================
       NORMALIZE LESSON
    ========================================== */

    function normalizeLesson(lesson) {

        if (
            !lesson ||
            typeof lesson !== "object"
        ) {

            return null;

        }


        return {

            id:
                Number(lesson.id) || 0,

            title:
                lesson.title || "Untitled Lesson",

            description:
                lesson.description || "",

            category:
                lesson.category || "General",

            level:
                lesson.level || "Beginner",

            xp:
                Number(lesson.xp) || 20,

            examples:
                Array.isArray(lesson.examples)
                    ? lesson.examples
                    : [],

            practice:
                Array.isArray(lesson.practice)
                    ? lesson.practice
                    : []

        };

    }


    /* ==========================================
       LOAD BUILT-IN LESSONS
    ========================================== */

    function getBuiltInLessons() {

        if (
            typeof EBLessons === "undefined" ||
            typeof EBLessons.getAll !== "function"
        ) {

            console.error(
                "Lesson Engine: built-in lesson source unavailable."
            );

            return {};

        }


        return EBLessons.getAll();

    }


    /* ==========================================
       GET ALL LESSONS
    ========================================== */

    function getAllLessons() {

        const sourceLessons =
            getBuiltInLessons();


        const normalizedLessons = {};


        Object.keys(sourceLessons).forEach(
            function (lessonId) {

                const lesson =
                    normalizeLesson(
                        sourceLessons[lessonId]
                    );


                if (
                    lesson &&
                    lesson.id > 0
                ) {

                    normalizedLessons[
                        lesson.id
                    ] = lesson;

                }

            }
        );


        return normalizedLessons;

    }


    /* ==========================================
       GET SINGLE LESSON
    ========================================== */

    function getLesson(lessonId) {

        const lessons =
            getAllLessons();


        return lessons[lessonId] || null;

    }


    /* ==========================================
       GET TOTAL LESSONS
    ========================================== */

    function getTotalLessons() {

        return Object.keys(
            getAllLessons()
        ).length;

    }


    /* ==========================================
       PUBLIC API
    ========================================== */

    window.EBLessonEngine = {

        getAll:
            getAllLessons,

        get:
            getLesson,

        getTotal:
            getTotalLessons,

        normalize:
            normalizeLesson

    };


    console.log(
        "English Buddy Pro: Lesson Engine initialized."
    );

})();
