/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   lesson-generator.js

   Responsibility:
   - Validate lesson structure
   - Normalize lesson data
   - Create/save generated lessons
   - Request AI-generated lessons
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

            id:
                lessonId,

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

            console.error(
                "Lesson Generator: failed to save lesson."
            );

            return {

                success: false,

                error:
                    "Failed to save lesson."

            };

        }


        return {

            success: true,

            lesson:
                lesson

        };

    }


    /* ==========================================
       GENERATE LESSON USING AI
    ========================================== */

    async function generateFromAI(
        level = "Beginner",
        topic = "Daily Life"
    ) {

        if (
            typeof EBLessonAI === "undefined" ||
            typeof EBLessonAI.generate !==
            "function"
        ) {

            console.error(
                "Lesson Generator: AI service unavailable."
            );

            return {

                success: false,

                error:
                    "AI service unavailable."

            };

        }


        try {

            const aiLesson =
                await EBLessonAI.generate(
                    level,
                    topic
                );


            if (
                !aiLesson
            ) {

                return {

                    success: false,

                    error:
                        "AI did not return a lesson."

                };

            }


            const result =
                createLesson(
                    aiLesson
                );


            return result;

        }

        catch (error) {

            console.error(
                "Lesson Generator: AI generation failed.",
                error
            );


            return {

                success: false,

                error:
                    "AI lesson generation failed."

            };

        }

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
            createLesson,

        generateFromAI:
            generateFromAI

    };


    /* ==========================================
       INITIALIZATION
    ========================================== */

    console.log(
        "English Buddy Pro: Lesson Generator initialized."
    );

})();
