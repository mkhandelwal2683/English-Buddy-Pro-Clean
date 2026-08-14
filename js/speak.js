/* ==========================================
   ENGLISH BUDDY PRO
   Clean Build v1.0

   speak.js
   Phase 1 — Speaking Foundation

   Responsibility:
   - Speech-to-Text
   - English / Hindi language selection
   - Microphone control
   - Live transcript
   - Automatic recognition resume
   - Clean transcript handling
========================================== */

(function () {

    "use strict";


    /* ==========================================
       SPEECH RECOGNITION
    ========================================== */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    let recognition = null;

    let isListening = false;

    let userStopped = false;

    let finalTranscript = "";

let finalSegments = [];

let restartTimer = null;

    /* ==========================================
       INITIALIZE SPEECH ENGINE
    ========================================== */

    function initializeSpeech() {

        if (!SpeechRecognition) {

            console.warn(
                "Speech Recognition is not supported by this browser."
            );

            showStatus(
                "⚠️ Speech recognition is not supported in this browser."
            );

            return false;

        }


        recognition =
            new SpeechRecognition();


        recognition.continuous =
            true;


        recognition.interimResults =
            true;


        recognition.lang =
            "en-IN";


        /* ======================================
           SPEECH START
        ====================================== */

        recognition.onstart =
            function () {

                isListening =
                    true;


                updateButtons();


                showStatus(
                    "🎙️ Listening... Speak now."
                );

            };


        /* ======================================
        /* ======================================
   SPEECH RESULT
====================================== */

recognition.onresult =
    function (event) {

        let interimTranscript = "";


        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const result =
                event.results[i];

            const transcript =
                result[0].transcript.trim();


            if (!transcript) {

                continue;

            }


            /* ----------------------------------
               FINAL RESULT
            ---------------------------------- */

            if (result.isFinal) {

                /*
                   Chrome/Android can progressively
                   return the same spoken phrase.

                   Example:

                   "good"
                   "good morning"
                   "good morning I"

                   Do not append these as separate
                   sentences.
                */

                const lastIndex =
                    finalSegments.length - 1;


                const lastSegment =
                    lastIndex >= 0
                        ? finalSegments[lastIndex]
                        : "";


                const currentLower =
                    transcript.toLowerCase();


                const lastLower =
                    lastSegment.toLowerCase();


                /*
                   New result extends the previous
                   result.

                   Example:

                   good
                   good morning

                   becomes:

                   good morning
                */

                if (
                    lastSegment &&
                    currentLower.startsWith(
                        lastLower
                    )
                ) {

                    finalSegments[lastIndex] =
                        transcript;

                }


                /*
                   Previous result is an extension
                   of the current result.

                   Ignore the shorter duplicate.
                */

                else if (
                    lastSegment &&
                    lastLower.startsWith(
                        currentLower
                    )
                ) {

                    // Ignore duplicate shorter result.

                }


                /*
                   Completely new speech.
                */

                else {

                    finalSegments.push(
                        transcript
                    );

                }

            }


            /* ----------------------------------
               INTERIM RESULT
            ---------------------------------- */

            else {

                interimTranscript +=
                    transcript + " ";

            }

        }


        /*
           Rebuild final transcript from the
           cleaned final segments.
        */

        finalTranscript =
            finalSegments.join(" ");


        updateTranscript(
            interimTranscript.trim()
        );

    };


        /* ======================================
           SPEECH END
        ====================================== */

        recognition.onend =
            function () {

                /*
                   Browser may automatically end
                   recognition after a short pause.

                   If user did NOT press Stop,
                   automatically restart.
                */

                if (
                    !userStopped &&
                    isListening
                ) {

                    scheduleRestart();

                    return;

                }


                /*
                   Genuine user stop.
                */

                isListening =
                    false;


                updateButtons();


                showStatus(
                    "⏹️ Speaking stopped."
                );

            };


        /* ======================================
           SPEECH ERROR
        ====================================== */

        recognition.onerror =
            function (event) {

                console.error(
                    "Speech recognition error:",
                    event.error
                );


                /*
                   Some browsers may fire an
                   'aborted' error when recognition
                   is restarted.

                   Do not treat it as a final stop
                   unless the user actually stopped.
                */

                if (
                    event.error === "aborted" &&
                    !userStopped
                ) {

                    return;

                }


                if (
                    event.error === "no-speech" &&
                    !userStopped
                ) {

                    showStatus(
                        "🎙️ Still listening... please speak."
                    );

                    return;

                }


                if (
                    event.error === "not-allowed"
                ) {

                    isListening =
                        false;

                    userStopped =
                        true;

                    updateButtons();

                    showStatus(
                        "🎙️ Microphone permission was denied."
                    );

                    return;

                }


                if (
                    event.error === "network"
                ) {

                    isListening =
                        false;

                    updateButtons();

                    showStatus(
                        "🌐 Network error while recognizing speech."
                    );

                    return;

                }


                if (userStopped) {

                    return;

                }


                showStatus(
                    "⚠️ Speech recognition error."
                );

            };



        return true;

    }


    /* ==========================================
       SCHEDULE AUTOMATIC RESTART
    ========================================== */

    function scheduleRestart() {

        clearTimeout(
            restartTimer
        );


        restartTimer =
            setTimeout(
                function () {

                    if (
                        userStopped
                    ) {

                        return;

                    }


                    try {

                        recognition.lang =
                            getSelectedLanguage();


                        recognition.start();

                    }

                    catch (error) {

                        /*
                           Recognition may already be
                           starting. Retry shortly.
                        */

                        if (
                            !userStopped
                        ) {

                            scheduleRestart();

                        }

                    }

                },
                250
            );

    }


    /* ==========================================
       START SPEAKING
    ========================================== */

    function startSpeaking() {

        if (!SpeechRecognition) {

            showStatus(
                "⚠️ Speech recognition is not supported."
            );

            return;

        }


        if (!recognition) {

            const initialized =
                initializeSpeech();


            if (!initialized) {

                return;

            }

        }


        if (isListening) {

            return;

        }


        clearTimeout(
            restartTimer
        );


        /*
           New speaking session.
        */

        userStopped =
            false;


        finalTranscript =
    "";

finalSegments =
    [];

clearTranscript();


        recognition.lang =
            getSelectedLanguage();


        try {

            recognition.start();

        }

        catch (error) {

            console.warn(
                "Speech recognition could not start:",
                error
            );

        }

    }


    /* ==========================================
       STOP SPEAKING
    ========================================== */

    function stopSpeaking() {

        /*
           Mark this as a genuine user stop
           BEFORE calling recognition.stop().
        */

        userStopped =
            true;


        clearTimeout(
            restartTimer
        );


        if (
            recognition
        ) {

            try {

                recognition.stop();

            }

            catch (error) {

                console.warn(
                    "Speech recognition stop error:",
                    error
                );

            }

        }


        isListening =
            false;


        updateButtons();


        showStatus(
            "⏹️ Speaking stopped."
        );

    }


    /* ==========================================
       GET SELECTED LANGUAGE
    ========================================== */

    function getSelectedLanguage() {

        const languageSelect =
            document.getElementById(
                "speakingLanguage"
            );


        if (
            languageSelect &&
            languageSelect.value
        ) {

            return languageSelect.value;

        }


        return "en-IN";

    }


    /* ==========================================
       UPDATE TRANSCRIPT
    ========================================== */

    function updateTranscript(
        interimTranscript
    ) {

        const transcriptElement =
            document.getElementById(
                "speechTranscript"
            );


        if (!transcriptElement) {

            return;

        }


        const cleanFinal =
            finalTranscript.trim();


        const cleanInterim =
            (
                interimTranscript || ""
            ).trim();


        const combined =
            (
                cleanFinal +
                (
                    cleanInterim
                        ? " " + cleanInterim
                        : ""
                )
            ).trim();


        transcriptElement.textContent =
            combined ||
            "Your speech will appear here.";


        /*
           Keep the final transcript available
           for the AI phase later.
        */

        transcriptElement.dataset.finalTranscript =
            cleanFinal;

    }


    /* ==========================================
       CLEAR TRANSCRIPT
    ========================================== */

    function clearTranscript() {

        const transcriptElement =
            document.getElementById(
                "speechTranscript"
            );


        if (!transcriptElement) {

            return;

        }


        finalTranscript =
    "";

finalSegments =
    [];


        transcriptElement.dataset.finalTranscript =
            "";


        transcriptElement.textContent =
            "Your speech will appear here.";

    }


    /* ==========================================
       UPDATE BUTTONS
    ========================================== */

    function updateButtons() {

        const startButton =
            document.getElementById(
                "startSpeaking"
            );


        const stopButton =
            document.getElementById(
                "stopSpeaking"
            );


        if (startButton) {

            startButton.disabled =
                isListening;

        }


        if (stopButton) {

            stopButton.disabled =
                !isListening;

        }

    }


    /* ==========================================
       UPDATE STATUS
    ========================================== */

    function showStatus(message) {

        const statusElement =
            document.getElementById(
                "speechStatus"
            );


        if (statusElement) {

            statusElement.textContent =
                message;

        }

    }


    /* ==========================================
       CREATE LANGUAGE SELECTOR
    ========================================== */

    function createLanguageSelector() {

        const speechCard =
            document.querySelector(
                ".speechCard"
            );


        if (!speechCard) {

            return;

        }


        if (
            document.getElementById(
                "speakingLanguage"
            )
        ) {

            return;

        }


        const languageContainer =
            document.createElement(
                "div"
            );


        languageContainer.className =
            "speechLanguageField";


        languageContainer.innerHTML = `

            <label for="speakingLanguage">
                🌐 Speaking Language
            </label>

            <select
                id="speakingLanguage"
                class="lessonSelector"
            >

                <option value="en-IN">
                    🇬🇧 English
                </option>

                <option value="hi-IN">
                    🇮🇳 Hindi
                </option>

            </select>

        `;


        speechCard.insertBefore(
            languageContainer,
            speechCard.firstChild
        );

    }


    /* ==========================================
       INITIALIZE UI
    ========================================== */

    function initializeSpeak() {

        createLanguageSelector();


        const startButton =
            document.getElementById(
                "startSpeaking"
            );


        const stopButton =
            document.getElementById(
                "stopSpeaking"
            );


        if (startButton) {

            startButton.addEventListener(
                "click",
                startSpeaking
            );

        }


        if (stopButton) {

            stopButton.addEventListener(
                "click",
                stopSpeaking
            );

        }


        updateButtons();


        console.log(
            "English Buddy Pro: Speaking module initialized."
        );

    }


    /* ==========================================
       PUBLIC API
    ========================================== */

    window.EBSpeaking = {

    initialize:
        initializeSpeak,

    start:
        startSpeaking,

    stop:
        stopSpeaking,

    clear:
        clearTranscript,

    getTranscript:
        function () {

            return finalTranscript.trim();

        },

    analyze:
        analyzeSpeaking

};


    /* ==========================================
       DOM READY
    ========================================== */

    document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeSpeak();

        initializeAICoach();

    }
);

/* ==========================================
   AI SPEAKING COACH
========================================== */

async function analyzeSpeaking() {

    const button =
        document.getElementById(
            "analyzeSpeaking"
        );


    const transcript =
        finalTranscript.trim();


    /* --------------------------------------
       CHECK TRANSCRIPT
    -------------------------------------- */

    if (!transcript) {

        alert(
            "🎙️ Please speak something first."
        );

        return;

    }


    /* --------------------------------------
       UPDATE BUTTON
    -------------------------------------- */

    if (button) {

        button.disabled =
            true;

        button.textContent =
            "⏳ AI Analyzing...";

    }


    showStatus(
        "🤖 AI is analyzing your English..."
    );


    try {

        const language =
            getSelectedLanguage();


        /* ----------------------------------
           SEND TO AI WORKER
        ---------------------------------- */

        const response =
            await fetch(
                "https://english-buddy-clean-lesson-ai.mkhandelwal2683.workers.dev/",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            type:
                                "speaking",

                            language:
                                language,

                            transcript:
                                transcript

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "AI Speaking Coach:",
            data
        );


        /* ----------------------------------
           CHECK RESPONSE
        ---------------------------------- */

        if (
            !response.ok ||
            !data ||
            data.success !== true ||
            !data.feedback
        ) {

            throw new Error(
                data && data.error
                    ? data.error
                    : "AI analysis failed."
            );

        }


        /* ----------------------------------
           DISPLAY FEEDBACK
        ---------------------------------- */

        displayAIFeedback(
            data.feedback,
            transcript
        );


        showStatus(
            "✅ AI analysis completed."
        );

    }

    catch (error) {

        console.error(
            "AI Speaking Coach error:",
            error
        );


        showStatus(
            "⚠️ AI analysis failed."
        );


        alert(
            "❌ Unable to analyze your speech.\n\n" +
            error.message
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "🤖 Analyze My Speech";

        }

    }

}
   /* ==========================================
   DISPLAY AI FEEDBACK
========================================== */

function displayAIFeedback(
    feedback,
    originalTranscript
) {

    const panel =
        document.getElementById(
            "aiSpeakingFeedback"
        );


    if (!panel) {

        return;

    }


    /* --------------------------------------
       ORIGINAL
    -------------------------------------- */

    setFeedbackText(
        "feedbackOriginal",
        originalTranscript
    );


    /* --------------------------------------
       CORRECT SENTENCE
    -------------------------------------- */

    setFeedbackText(
        "feedbackCorrect",
        feedback.correctSentence
    );


    /* --------------------------------------
       GRAMMAR
    -------------------------------------- */

    setFeedbackText(
        "feedbackGrammar",
        feedback.grammarExplanation
    );


    /* --------------------------------------
       HINDI
    -------------------------------------- */

    setFeedbackText(
        "feedbackHindi",
        feedback.hindiExplanation
    );


    /* --------------------------------------
       NATURAL ENGLISH
    -------------------------------------- */

    setFeedbackText(
        "feedbackNatural",
        feedback.naturalEnglish
    );


    /* --------------------------------------
       VOCABULARY
    -------------------------------------- */

    setFeedbackText(
        "feedbackVocabulary",
        feedback.vocabularySuggestions
    );


    /* --------------------------------------
       SCORES
    -------------------------------------- */

    setFeedbackText(
        "feedbackGrammarScore",
        feedback.grammarScore
    );


    setFeedbackText(
        "feedbackFluencyScore",
        feedback.fluencyScore
    );


    setFeedbackText(
        "feedbackVocabularyScore",
        feedback.vocabularyScore
    );


    setFeedbackText(
        "feedbackOverallScore",
        feedback.overallScore
    );


    /* --------------------------------------
       COACH MESSAGE
    -------------------------------------- */

    setFeedbackText(
        "feedbackCoachMessage",
        feedback.coachMessage
    );


    /* --------------------------------------
       SHOW PANEL
    -------------------------------------- */

    panel.style.display =
        "block";


    panel.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}
   /* ==========================================
   FEEDBACK TEXT HELPER
========================================== */

function setFeedbackText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? value
            : "Not available";

}
   /* ==========================================
   AI BUTTON INITIALIZATION
========================================== */

function initializeAICoach() {

    const button =
        document.getElementById(
            "analyzeSpeaking"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        analyzeSpeaking
    );

}
   
   
})();
