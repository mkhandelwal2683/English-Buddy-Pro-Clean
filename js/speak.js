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
           SPEECH RESULT
        ====================================== */

        recognition.onresult =
            function (event) {

                let interimTranscript =
                    "";


                /*
                   Process only the results supplied
                   by the current recognition event.

                   Final results are added once.
                */

                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    const result =
                        event.results[i];


                    const transcript =
                        result[0].transcript;


                    if (
                        result.isFinal
                    ) {

                        finalTranscript +=
                            transcript + " ";

                    }

                    else {

                        interimTranscript +=
                            transcript;

                    }

                }


                updateTranscript(
                    interimTranscript
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
