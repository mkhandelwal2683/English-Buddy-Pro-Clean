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
   GENERATED LESSON SOURCE
========================================== */

const generatedLessons = {

    5: {

        id: 5,

        title: "Shopping and Prices",

        description:
            "Learn useful English sentences for shopping.",

        category:
            "Daily Life",

        level:
            "Beginner",

        xp:
            20,

        examples: [

            {
                hindi: "यह कितने का है?",
                english: "How much does this cost?"
            },

            {
                hindi: "क्या यह सस्ता है?",
                english: "Is this cheaper?"
            },

            {
                hindi: "मुझे यह चाहिए।",
                english: "I would like this."
            },

            {
                hindi: "क्या आपके पास दूसरा रंग है?",
                english: "Do you have another color?"
            },

            {
                hindi: "मैं कार्ड से भुगतान करूंगा।",
                english: "I will pay by card."
            }

        ],

        practice: [

            {
                hindi: "यह बहुत महंगा है।",
                english: "This is very expensive."
            },

            {
                hindi: "क्या आप मुझे छूट दे सकते हैं?",
                english: "Can you give me a discount?"
            },

            {
                hindi: "मुझे बिल चाहिए।",
                english: "I need the bill."
            }

        ]

    }

};
   

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
   LOAD GENERATED LESSONS
========================================== */

function getGeneratedLessons() {

    return generatedLessons;

}
   
    /* ==========================================
   GET ALL LESSONS
========================================== */

function getAllLessons() {

    const builtInLessons =
        getBuiltInLessons();


    const futureGeneratedLessons =
        getGeneratedLessons();


    const allSourceLessons = {

        ...builtInLessons,

        ...futureGeneratedLessons

    };


    const normalizedLessons = {};


    Object.keys(allSourceLessons).forEach(
        function (lessonId) {

            const lesson =
                normalizeLesson(
                    allSourceLessons[lessonId]
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

    getGenerated:
        getGeneratedLessons,

    normalize:
        normalizeLesson

};


    console.log(
        "English Buddy Pro: Lesson Engine initialized."
    );

})();
