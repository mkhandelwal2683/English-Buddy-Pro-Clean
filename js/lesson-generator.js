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

    /* --------------------------------------
       Basic lesson object
    -------------------------------------- */

    if (
        !lesson ||
        typeof lesson !== "object"
    ) {

        return false;

    }


    /* --------------------------------------
       Title
    -------------------------------------- */

    if (
        typeof lesson.title !== "string" ||
        lesson.title.trim().length === 0
    ) {

        return false;

    }


    /* --------------------------------------
       Description
    -------------------------------------- */

    if (
        typeof lesson.description !== "string" ||
        lesson.description.trim().length === 0
    ) {

        return false;

    }


    /* --------------------------------------
       Examples
    -------------------------------------- */

    if (
        !Array.isArray(lesson.examples) ||
        lesson.examples.length === 0
    ) {

        return false;

    }


    const validExamples =
        lesson.examples.every(
            function (example) {

                return (
                    example &&
                    typeof example === "object" &&

                    typeof example.hindi === "string" &&
                    example.hindi.trim().length > 0 &&

                    typeof example.english === "string" &&
                    example.english.trim().length > 0
                );

            }
        );


    if (!validExamples) {

        return false;

    }


    /* --------------------------------------
       Practice
    -------------------------------------- */

    if (
        !Array.isArray(lesson.practice) ||
        lesson.practice.length === 0
    ) {

        return false;

    }


    const validPractice =
        lesson.practice.every(
            function (practiceItem) {

                return (
                    practiceItem &&
                    typeof practiceItem === "object" &&

                    typeof practiceItem.hindi === "string" &&
                    practiceItem.hindi.trim().length > 0 &&

                    typeof practiceItem.english === "string" &&
                    practiceItem.english.trim().length > 0
                );

            }
        );


    if (!validPractice) {

        return false;

    }


    /* --------------------------------------
       Lesson validation passed
    -------------------------------------- */

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
   CHECK DUPLICATE LESSON
========================================== */

function isDuplicateLesson(title) {

    if (
        !title ||
        typeof title !== "string"
    ) {

        return false;

    }


    if (
        typeof EBLessonEngine === "undefined" ||
        typeof EBLessonEngine.getAll !== "function"
    ) {

        return false;

    }


    const lessons =
        EBLessonEngine.getAll();


    const normalizedTitle =
        title
            .trim()
            .toLowerCase();


    return Object.keys(lessons).some(
        function (lessonId) {

            const lesson =
                lessons[lessonId];


            if (
                !lesson ||
                typeof lesson.title !== "string"
            ) {

                return false;

            }


            return (
                lesson.title
                    .trim()
                    .toLowerCase()
                ===
                normalizedTitle
            );

        }
    );

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

/* --------------------------------------
   Prevent duplicate lesson
-------------------------------------- */

if (
    isDuplicateLesson(
        lessonData.title
    )
) {

    console.warn(
        "Lesson Generator: duplicate lesson detected."
    );

    return {

        success: false,

        error:
            "A lesson with this title already exists."

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


            /* --------------------------------------
   Apply user-selected metadata
-------------------------------------- */

const generatedLesson = {

    ...aiLesson,

    level:
        level,

    category:
        topic

};


/* --------------------------------------
   Validate and save lesson
-------------------------------------- */

const result =
    createLesson(
        generatedLesson
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

    isDuplicate:
        isDuplicateLesson,

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
