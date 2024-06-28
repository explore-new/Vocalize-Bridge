document.addEventListener('DOMContentLoaded', function () {
  const clickToRecordBtn = document.getElementById('click_to_record');
  const textToVoiceBtn = document.getElementById('text_to_voice');
  const convertText = document.getElementById('convert_text');
  const resetButton = document.getElementById('reset_button');
  let isRecording = false;
  let recognition;

  clickToRecordBtn.addEventListener('click', function () {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  resetButton.addEventListener('click', function () {
    stopRecording();
    speechSynthesis.cancel(); // Stop any ongoing speech synthesis
    convertText.innerHTML = ''; // Clear the content of convertText
  });

  function startRecording() {
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true; // Ensure continuous recognition

    recognition.addEventListener('start', function () {
      isRecording = true;
      clickToRecordBtn.textContent = 'Recording...';
      clickToRecordBtn.classList.add('recording');
    });

    recognition.addEventListener('end', function () {
      isRecording = false;
      clickToRecordBtn.textContent = 'Voice To Text';
      clickToRecordBtn.classList.remove('recording');
    });

    recognition.addEventListener('result', function (e) {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript + ' ';
      }

      convertText.innerText = transcript.trim();
      console.log(transcript);
    });

    recognition.addEventListener('error', function (event) {
      console.error('Speech recognition error detected: ' + event.error);
      recognition.stop();
    });

    recognition.start();
  }

  function stopRecording() {
    if (recognition) {
      recognition.stop();
    }
    isRecording = false;
    clickToRecordBtn.textContent = 'Voice To Text';
    clickToRecordBtn.classList.remove('recording');
  }

  textToVoiceBtn.addEventListener('click', function () {
    const text = convertText.innerText;
    if (text) {
      const words = text.split(/\s+/);
      speakWordsSequentially(words);
    } else {
      alert("Please enter text to convert to voice.");
    }
  });

  function speakWordsSequentially(words) {
    let wordIndex = 0;

    function speakNextWord() {
      if (wordIndex < words.length) {
        const utterance = new SpeechSynthesisUtterance(words[wordIndex]);
        const voices = speechSynthesis.getVoices();
        const femaleVoices = voices.filter(voice => voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman"));

        if (femaleVoices.length > 0) {
          utterance.voice = femaleVoices[0];
        } else {
          alert("Female voice not found, using default voice.");
        }

        utterance.onstart = function () {
          highlightWord(wordIndex);
          scrollToWord(wordIndex);
        };

        utterance.onend = function () {
          removeHighlight(wordIndex);
          wordIndex++;
          scrollToWord(wordIndex);
          speakNextWord();
        };

        speechSynthesis.speak(utterance);
      }
    }

    speakNextWord();
  }

  function highlightWord(index) {
    const words = convertText.innerText.split(/\s+/);
    let html = '';
    for (let i = 0; i < words.length; i++) {
      if (i === index) {
        html += `<span class="highlight">${words[i]}</span> `;
      } else {
        html += `${words[i]} `;
      }
    }
    convertText.innerHTML = html.trim();
  }

  function removeHighlight(index) {
    const words = convertText.innerText.split(/\s+/);
    let html = '';
    for (let i = 0; i < words.length; i++) {
      html += `${words[i]} `;
    }
    convertText.innerHTML = html.trim();
  }

  function scrollToWord(index) {
    const words = convertText.innerText.split(/\s+/);
    let yOffset = 0;
    for (let i = 0; i < index; i++) {
      // Adjust the scroll based on the height of the line
      yOffset += convertText.scrollHeight / words.length;
    }
    convertText.scrollTop = yOffset;
  }

  // Load voices when they are ready
  speechSynthesis.onvoiceschanged = function () {
    speechSynthesis.getVoices();
  };
});
