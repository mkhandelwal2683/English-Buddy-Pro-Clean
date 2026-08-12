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
   - Speaking status
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
           SPEECH RESULT
        ====================================== */

        recognition.onresult =
            function (event) {

                let finalTranscript = "";

                let interimTranscript = "";


                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    const transcript =
                        event.results[i][0].transcript;


                    if (
                        event.results[i].isFinal
                    ) {

                        finalTranscript +=
                            transcript + " ";

                    }

                    else {

                        interimTranscript +=
                            transcript;

                    }

                }


                const transcriptElement =
                    document.getElementById(
                        "speechTranscript"
                    );


                if (!transcriptElement) {

                    return;

                }


                const existingFinal =
                    transcriptElement.dataset.finalTranscript ||
                    "";


                const combinedFinal =
                    (
                        existingFinal +
                        finalTranscript
                    ).trim();


                transcriptElement.dataset.finalTranscript =
                    combinedFinal;


                transcriptElement.textContent =
                    (
                        combinedFinal +
                        (
                            interimTranscript
                                ? " " + interimTranscript
                                : ""
                        )
                    ).trim();

            };


        /* ======================================
           SPEECH END
        ====================================== */

        recognition.onend =
            function () {

                isListening =
                    false;


                updateButtons();


                showStatus(
                    "✅ Speaking stopped."
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


                isListening =
                    false;


                updateButtons();


                let message =
                    "⚠️ Speech recognition error.";


                if (
                    event.error ===
                    "not-allowed"
                ) {

                    message =
                        "🎙️ Microphone permission was denied.";

                }

                else if (
                    event.error ===
                    "no-speech"
                ) {

                    message =
                        "🔇 No speech detected. Please try again.";

                }

                else if (
                    event.error ===
                    "network"
                ) {

                    message =
                        "🌐 Network error while recognizing speech.";

                }


                showStatus(
                    message
                );

            };


        return true;

    }


    /* ==========================================
       START SPEAKING
    ========================================== */

    function startSpeaking() {

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

        if (
            recognition &&
            isListening
        ) {

            recognition.stop();

        }

        else {

            isListening =
                false;


            updateButtons();


            showStatus(
                "Ready to speak"
            );

        }

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

                const transcriptElement =
                    document.getElementById(
                        "speechTranscript"
                    );


                if (!transcriptElement) {

                    return "";

                }


                return (
                    transcriptElement.dataset.finalTranscript ||
                    ""
                ).trim();

            }

    };


    /* ==========================================
       DOM READY
    ========================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeSpeak();

        }
    );


})();
