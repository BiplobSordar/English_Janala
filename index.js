

const fetchJSON = async (url) => {
  const res = await fetch(url);
  return res.json();
};

const loadLessons = async () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  const json = await fetchJSON(url);
  displayLessons(json.data);
};

const wordsLevel = async (levelNo) => {
  const url = `https://openapi.programming-hero.com/api/level/${levelNo}`;
  const data = await fetchJSON(url);
  displayWords(data.data);
};

const wordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const json = await fetchJSON(url);
  openModal(json.data);
};


const displayLessons = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  lessons.forEach((lesson) => {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
      <button class="lesson_btn btn btn-outline btn-primary px-6 py-2 rounded-full">
        <i class="fa-solid fa-book-open"></i>
        Lesson - ${lesson.level_no}
      </button>
    `;
    levelContainer.append(btnDiv);

    const lessonBtn = btnDiv.querySelector(".lesson_btn");

    lessonBtn.addEventListener("click", () => {

      document.querySelectorAll(".lesson_btn").forEach((b) => {
        b.classList.remove("bg-primary", "text-white");
        b.classList.add("btn-outline");
      });

  
      lessonBtn.classList.add("bg-primary", "text-white");
      lessonBtn.classList.remove("btn-outline");

 
      wordsLevel(lesson.level_no);
    });
  });
};


const modal = document.getElementById("myModal");

function openModal(wdata) {
  modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
        <button class="absolute top-4 right-4 text-white/80 hover:text-white" onclick="closeModal()">
          <i class="fa-solid fa-xmark text-2xl"></i>
        </button>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-sm font-medium bg-white/20 py-1 px-3 rounded-full">Level ${wdata?.level}</span>
            <h2 class="text-4xl font-bold mt-3">${wdata?.word}</h2>
            <p class="text-blue-100 font-mono mt-1 text-lg">${wdata?.pronunciation}</p>
          </div>
          <div class="text-right">
            <div class="points-badge bg-amber-400 text-amber-900 py-2 px-4 rounded-full text-lg font-bold">
              <i class="fa-solid fa-star mr-1"></i>${wdata?.points} Points
            </div>
            <p class="text-xs font-medium opacity-80 mt-2">ID: ${wdata?.id}</p>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-semibold text-gray-500 mb-2">MEANING</h3>
              <p class="text-xl text-gray-800">${wdata?.meaning}</p>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-500 mb-2">PART OF SPEECH</h3>
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-lg font-medium text-blue-700">${wdata?.partsOfSpeech}</p>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-500 mb-2">PRONUNCIATION</h3>
              <div class="bg-gray-50 rounded-lg p-4 flex items-center">
                <i class="fa-solid fa-volume-high sound-btn text-blue-500 text-xl mr-3"></i>
                <p class="text-lg font-mono">${wdata?.pronunciation}</p>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-semibold text-gray-500 mb-2">EXAMPLE SENTENCE</h3>
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-gray-700 text-lg">${wdata?.sentence}</p>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-500 mb-2">SYNONYMS</h3>
              <div class="flex flex-wrap gap-2">
                ${
                  wdata?.synonyms?.map(
                    (item) =>
                      `<span class="synonym-tag bg-blue-100 text-blue-700 py-2 px-4 rounded-full">${item}</span>`
                  ).join("") || "<p class='text-gray-500'>No synonyms available</p>"
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="bg-gray-50 px-6 py-4 flex justify-end">
        <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors" onclick="closeModal()">
          Close
        </button>
      </div>
    </div>
  `;


  addSound(modal.querySelector(".sound-btn"), wdata.word);

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}


const displayWords = (words) => {
  const wordsContainer = document.getElementById("word-container");
  wordsContainer.innerHTML = "";

  if (!words?.length) {
    wordsContainer.innerHTML = `
      <div class="flex flex-col justify-center items-center col-span-3">
        <img src="./assets/alert-error.png">
        <p class="font-semibold text-[0.9rem]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="text-2xl">নেক্সট Lesson এ যান</h2>
      </div>
    `;
    return;
  }

  words.forEach((word) => {
    const wordCard = document.createElement("div");
    wordCard.classList.add("word-card");
    wordCard.innerHTML = `
      <div class="vocab-card bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-sm font-medium bg-white/20 py-1 px-3 rounded-full">Level ${word?.level}</span>
              <h2 class="text-3xl font-bold mt-3">${word?.word}</h2>
              <p class="text-indigo-100 font-mono mt-1">${word?.pronunciation}</p>
            </div>
            <div class="text-right">
              <span class="text-xs font-medium opacity-80">ID: ${word?.id}</span>
              <button class="sound-btn mt-4 bg-white/20 text-white p-3 rounded-full">
                <i class="fa-solid sound-icon fa-volume-high text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-500">MEANING</h3>
            <p class="text-xl text-gray-800 mt-3">${word?.meaning}</p>
          </div>
        </div>

        <div class="mt-6 h-14 w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 p-5 card-click text-white flex items-center justify-center" onclick='wordDetails(${word?.id})'>
          <div class="py-2 px-4 rounded-lg text-sm font-medium">
            <i class="fa-solid fa-arrow-right mr-1"></i> Click for details
          </div>
        </div>
      </div>
    `;

    wordsContainer.append(wordCard);

    // Attach sound
    addSound(wordCard.querySelector(".sound-btn"), word.word);
  });
};


const addSound = (btn, word) => {
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  });
};


loadLessons();
