/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   lessons-data.js

   Responsibility:
   - Store lesson content
   - Provide lessons to Learn module
========================================== */

(function () {

    "use strict";


    /* ==========================================
       LESSON DATA
    =========================================== */

    const lessons = {

        1: {

            id: 1,

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

            id: 2,

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
       PUBLIC API
    =========================================== */

    window.EBLessons = {

        getAll:
            function () {

                return lessons;

            },


        get:
            function (lessonId) {

                return lessons[lessonId] || null;

            },


        getTotal:
            function () {

                return Object.keys(
                    lessons
                ).length;

            }

    };


    console.log(
        "English Buddy Pro: Lesson data initialized."
    );

})();
