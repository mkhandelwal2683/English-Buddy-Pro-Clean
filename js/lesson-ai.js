/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   lesson-ai.js

   Responsibility:
   - Provide AI lesson generation interface
   - Communicate with backend AI service
   - Return structured lesson data
========================================== */

(function () {

    "use strict";


    /* ==========================================
       CONFIGURATION
    ========================================== */

    const CONFIG = {

        WORKER_URL:
            "",

        REQUEST_TIMEOUT:
            30000

    };


    /* ==========================================
       GENERATE LESSON
    ========================================== */

    async function generateLesson(options = {}) {

        if (!CONFIG.WORKER_URL) {

            throw new Error(
                "Lesson AI service is not configured yet."
            );

        }


        const controller =
            new AbortController();


        const timeout =
            setTimeout(
                function () {

                    controller.abort();

                },
                CONFIG.REQUEST_TIMEOUT
            );


        try {

            const response =
                await fetch(
                    CONFIG.WORKER_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                action:
                                    "generate_lesson",

                                level:
                                    options.level ||
                                    "Beginner",

                                topic:
                                    options.topic ||
                                    "Daily Life",

                                count:
                                    1

                            }),

                        signal:
                            controller.signal

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "AI service request failed: " +
                    response.status
                );

            }


            const data =
                await response.json();


            if (
                !data ||
                !data.lesson
            ) {

                throw new Error(
                    "AI service returned invalid lesson data."
                );

            }


            return data.lesson;

        } finally {

            clearTimeout(timeout);

        }

    }


    /* ==========================================
       PUBLIC API
    ========================================== */

    window.EBLessonAI = {

        generate:
            generateLesson

    };


    console.log(
        "English Buddy Pro: Lesson AI service initialized."
    );

})();
