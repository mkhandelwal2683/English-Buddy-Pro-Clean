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

category: "Basics",

level: "Beginner",

xp: 20,
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

category: "Conversation",

level: "Beginner",

xp: 20,
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

        },

               3: {

            id: 3,

            title: "Introducing Yourself",

            description:
                "Learn simple English sentences to introduce yourself.",

            category: "Conversation",

            level: "Beginner",

            xp: 20,

            examples: [

                {
                    hindi: "मेरा नाम अमित है।",
                    english: "My name is Amit."
                },

                {
                    hindi: "मैं भारत से हूँ।",
                    english: "I am from India."
                },

                {
                    hindi: "मैं एक छात्र हूँ।",
                    english: "I am a student."
                },

                {
                    hindi: "मुझे अंग्रेज़ी सीखना पसंद है।",
                    english: "I like learning English."
                },

                {
                    hindi: "आपसे मिलकर खुशी हुई।",
                    english: "Nice to meet you."
                }

            ]

               },
               4: {

            id: 4,

            title: "Talking About Your Family",

            description:
                "Learn useful English sentences to talk about your family.",

            category: "Conversation",

            level: "Beginner",

            xp: 30,

            examples: [

                {
                    hindi: "मेरा एक भाई है।",
                    english: "I have a brother."
                },

                {
                    hindi: "मेरी एक बहन है।",
                    english: "I have a sister."
                },

                {
                    hindi: "मेरे पिता काम करते हैं।",
                    english: "My father works."
                },

                {
                    hindi: "मेरी माँ घर पर हैं।",
                    english: "My mother is at home."
                },

                {
                    hindi: "मेरा परिवार बहुत प्यारा है।",
                    english: "My family is very lovely."
                }
               
               ],

            practice: [

                {
                    hindi: "मेरे परिवार में चार लोग हैं।",
                    english: "There are four people in my family."
                },

                {
                    hindi: "मेरे पिता बहुत मेहनती हैं।",
                    english: "My father is very hardworking."
                },

                {
                    hindi: "मेरी माँ स्वादिष्ट खाना बनाती हैं।",
                    english: "My mother cooks delicious food."
                },

                {
                    hindi: "मैं अपने परिवार से प्यार करता हूँ।",
                    english: "I love my family."
                },

                {
                    hindi: "हम साथ में समय बिताते हैं।",
                    english: "We spend time together."
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
