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
   TEST GENERATED LESSON
========================================== */

function addTestLesson() {

    const existingLessons =
        typeof EBStorage !== "undefined" &&
        typeof EBStorage.getGeneratedLessons ===
        "function"

            ? EBStorage.getGeneratedLessons()

            : {};


    if (
        existingLessons[7]
    ) {

        return;

    }


    const result =
        createLesson({

            title:
                "Travel and Directions",

            description:
                "Learn useful English sentences for asking and giving directions.",

            category:
                "Travel",

            level:
                "Beginner",

            xp:
                20,

            examples: [

                {
                    hindi:
                        "बस स्टॉप कहाँ है?",

                    english:
                        "Where is the bus stop?"
                },

                {
                    hindi:
                        "मुझे रेलवे स्टेशन जाना है।",

                    english:
                        "I need to go to the railway station."
                },

                {
                    hindi:
                        "सीधे जाइए।",

                    english:
                        "Go straight."
                },

                {
                    hindi:
                        "बाएं मुड़िए।",

                    english:
                        "Turn left."
                },

                {
                    hindi:
                        "क्या यह यहाँ से दूर है?",

                    english:
                        "Is it far from here?"
                }

            ],

            practice: [

                {
                    hindi:
                        "कृपया मुझे रास्ता बताइए।",

                    english:
                        "Please tell me the way."
                },

                {
                    hindi:
                        "दाईं ओर मुड़िए।",

                    english:
                        "Turn right."
                },

                {
                    hindi:
                        "यह बहुत पास है।",

                    english:
                        "It is very near."
                }

            ]

        }
    );


    console.log(
        "Lesson Generator test result:",
        result
    );

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

addTestLesson();
   
    console.log(

       
        "English Buddy Pro: Lesson Generator initialized."
    );

})();
