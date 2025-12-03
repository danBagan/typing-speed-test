document.addEventListener('DOMContentLoaded', () => {
    // Sample texts for the typing test
    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. Programming is both an art and a science that requires practice and patience.",
        "Life is what happens when you're busy making other plans. Every moment counts, so make the most of your time and energy.",
        "To be or not to be, that is the question. Whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune.",
        "In the middle of difficulty lies opportunity. Success is not final, failure is not fatal, it is the courage to continue that counts.",
        "The only way to do great work is to love what you do. Stay hungry, stay foolish, and never stop learning new things."
    ];

    // DOM elements
    const textDisplay = document.getElementById('text-display');
    const inputField = document.getElementById('input-field');
    const startBtn = document.getElementById('start-btn');
    const timerDisplay = document.getElementById('timer');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const modal = document.getElementById('result-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalWpm = document.getElementById('modal-wpm');
    const modalAccuracy = document.getElementById('modal-accuracy');
    const modalTime = document.getElementById('modal-time');
    const modalTitle = document.getElementById('modal-title');

    // Game state
    let currentText = '';
    let timeLeft = 60;
    let timerInterval = null;
    let isTestActive = false;

    // Initialize
    function init() {
        currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        textDisplay.textContent = currentText;
        inputField.value = '';
        inputField.disabled = true;
        timeLeft = 60;
        timerDisplay.textContent = timeLeft;
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '100';
        isTestActive = false;
    }

    // Start the test
    startBtn.addEventListener('click', () => {
        if (!isTestActive) {
            isTestActive = true;
            inputField.disabled = false;
            inputField.focus();
            startBtn.textContent = 'Reset Test';
            startTimer();
        } else {
            // Reset
            clearInterval(timerInterval);
            init();
            startBtn.textContent = 'Start Test';
        }
    });

    // Timer function
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endTest(false);
            }
        }, 1000);
    }

    // End the test
    function endTest(completed) {
        clearInterval(timerInterval);
        isTestActive = false;
        inputField.disabled = true;
        startBtn.textContent = 'Start Again';
        
        // Show fancy modal
        showResultModal(completed);
    }

    // Show result modal
    function showResultModal(completed) {
        const wpm = wpmDisplay.textContent;
        const accuracy = accuracyDisplay.textContent;
        const timeTaken = 60 - timeLeft;
        
        // Determine title based on how test ended
        if (completed) {
            modalTitle.textContent = '🎉 Perfect! You completed it!';
        } else {
            modalTitle.textContent = '⏰ Time\'s Up!';
        }
        
        modalWpm.textContent = wpm;
        modalAccuracy.textContent = accuracy + '%';
        modalTime.textContent = timeTaken + 's';
        
        modal.classList.add('show');
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('show');
    }

    closeModalBtn.addEventListener('click', () => {
        closeModal();
        clearInterval(timerInterval);
        init();
        startBtn.textContent = 'Start Test';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle input and calculate stats
    inputField.addEventListener('input', () => {
        if (!isTestActive) return;
        
        const typedText = inputField.value;
        const typedLength = typedText.length;
        
        // Highlight correct/incorrect characters
        let displayHTML = '';
        for (let i = 0; i < currentText.length; i++) {
            if (i < typedLength) {
                if (typedText[i] === currentText[i]) {
                    displayHTML += `<span class="correct">${currentText[i]}</span>`;
                } else {
                    displayHTML += `<span class="incorrect">${currentText[i]}</span>`;
                }
            } else {
                displayHTML += currentText[i];
            }
        }
        textDisplay.innerHTML = displayHTML;
        
        // Calculate WPM (Words Per Minute)
        const timeElapsed = 60 - timeLeft;
        const wordsTyped = typedText.trim().split(/\s+/).length;
        const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
        wpmDisplay.textContent = wpm;
        
        // Calculate Accuracy
        let correctChars = 0;
        for (let i = 0; i < typedLength; i++) {
            if (typedText[i] === currentText[i]) {
                correctChars++;
            }
        }
        const accuracy = typedLength > 0 ? Math.round((correctChars / typedLength) * 100) : 100;
        accuracyDisplay.textContent = accuracy;
        
        // Check if user finished typing the text
        console.log('Typed length:', typedLength);
        console.log('Current text length:', currentText.length);
        console.log('Are they equal?', typedText === currentText);
        
        if (typedText === currentText) {
            console.log('Test complete! Calling endTest(true)');
            endTest(true);
        }
    });

    // Initialize on page load
    init();
});