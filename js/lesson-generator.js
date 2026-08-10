/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   lesson-generator.js

   Responsibility:
   - Accept new lesson objects
   - Validate lesson structure
   - Normalize lesson data
   - Save generated lessons
========================================== */

(function () {

    "use strict";


    /* ==========================================
       VALIDATE LESSON
    ========================================== */

    function validateLesson(lesson) {

        if (
            !lesson ||
            typeof lesson !== "object"
        ) {

            return false;

        }


        if (
            !lesson.title ||
            typeof lesson.title !== "string"
        ) {

            return false;

        }


        if (
            !lesson.description ||
            typeof lesson.description !== "string"
        ) {

            return false;

        }


        if (
            !Array.isArray(lesson.examples) ||
            lesson.examples.length === 0
        ) {

            return false;

        }


        if (
            !Array.isArray(lesson.practice) ||
            lesson.practice.length === 0
        ) {

            return false;

        }


        return true;

    }


    /* ==========================================
       GET NEXT LESSON ID
    ========================================== */

    function getNextLessonId() {

        if (
            typeof EBLessonEngine === "undefined" ||
            typeof EBLessonEngine.getAll !== "function"
        ) {

            return 1;

        }


        const lessons =
            EBLessonEngine.getAll();


        const lessonIds =
            Object.keys(lessons)
                .map(
                    function (id) {

                        return Number(id);

                    }
                )
                .filter(
                    function (id) {

                        return Number.isFinite(id);

                    }
                );


        if (lessonIds.length === 0) {

            return 1;

        }


        return Math.max(
            ...lessonIds
        ) + 1;

    }


    /* ==========================================
       CREATE GENERATED LESSON
    ========================================== */

    function createLesson(lessonData) {

        if (
            !validateLesson(lessonData)
        ) {

            console.error(
                "Lesson Generator: invalid lesson data."
            );

            return {

                success: false,

                error:
                    "Invalid lesson data."

            };

        }


        if (
            typeof EBStorage === "undefined" ||
            typeof EBStorage.addGeneratedLesson !==
            "function"
        ) {

            console.error(
                "Lesson Generator: storage unavailable."
            );

            return {

                success: false,

                error:
                    "Storage unavailable."

            };

        }


        const lessonId =
            getNextLessonId();


        const lesson = {

            id: lessonId,

            title:
                lessonData.title.trim(),

            description:
                lessonData.description.trim(),

            category:
                lessonData.category ||
                "General",

            level:
                lessonData.level ||
                "Beginner",

            xp:
                Number(lessonData.xp) || 20,

            examples:
                lessonData.examples,

            practice:
                lessonData.practice

        };


        const saved =
            EBStorage.addGeneratedLesson(
                lesson
            );


        if (!saved) {

            return {

                success: false,

                error:
                    "Failed to save lesson."

            };

        }


        return {

            success: true,

            lesson: lesson

        };

    }


    /* ==========================================
       PUBLIC API
    ========================================== */

    window.EBLessonGenerator = {

        validate:
            validateLesson,

        getNextId:
            getNextLessonId,

        create:
            createLesson

    };


    console.log(
        "English Buddy Pro: Lesson Generator initialized."
    );

})();
