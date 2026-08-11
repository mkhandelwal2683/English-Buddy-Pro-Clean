/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   lesson-ai.js

   Responsibility:
   - Connect Learn module to AI Worker
   - Request AI-generated lessons
   - Return structured lesson data
========================================== */

(function () {

    "use strict";


    /* ==========================================
       AI WORKER CONFIGURATION
    ========================================== */

    const WORKER_URL =
        "https://english-buddy-clean-lesson-ai.mkhandelwal2683.workers.dev/";


    /* ==========================================
       GENERATE LESSON
    ========================================== */

    async function generateLesson(
        level = "Beginner",
        topic = "Daily Life"
    ) {

        try {

            const response =
                await fetch(
                    WORKER_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                level:
                                    level,

                                topic:
                                    topic

                            })

                    }
                );


            /* ======================================
               CHECK HTTP RESPONSE
            ====================================== */

            if (!response.ok) {

                console.error(
                    "Lesson AI request failed:",
                    response.status
                );

                return null;

            }


            /* ======================================
               READ RESPONSE
            ====================================== */

            const data =
                await response.json();


            /* ======================================
               CHECK AI RESULT
            ====================================== */

            if (
                !data ||
                data.success !== true ||
                !data.lesson
            ) {

                console.error(
                    "Lesson AI returned invalid data:",
                    data
                );

                return null;

            }


            return data.lesson;

        }

        catch (error) {

            console.error(
                "Lesson AI connection failed:",
                error
            );

            return null;

        }

    }


    /* ==========================================
       PUBLIC API
    ========================================== */

    window.EBLessonAI = {

        generate:
            generateLesson

    };


    /* ==========================================
       INITIALIZATION
    ========================================== */

    console.log(
        "English Buddy Pro: Lesson AI initialized."
    );

})();
