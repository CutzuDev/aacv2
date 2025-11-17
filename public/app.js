// src/app.ts
var state = {
  vocabulary: [],
  currentCategory: "all",
  draggedElement: null,
  touchDragging: false,
  cachedVoices: []
};
function byId(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" was not found in DOM.`);
  }
  return element;
}
var wordGrid = byId("wordGrid");
var sentenceArea = byId("sentenceArea");
var sentenceText = byId("sentenceText");
var sentencePlaceholder = byId("sentencePlaceholder");
var speakBtn = byId("speakBtn");
var clearBtn = byId("clearBtn");
var categoryButtons = Array.from(
  document.querySelectorAll(".category-row .btn")
);
var isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
if (isTouchDevice) {
  document.body.classList.add("is-touch");
}
function refreshPlaceholder() {
  const hasWords = sentenceArea.querySelectorAll(".sentence-word").length > 0;
  sentencePlaceholder.style.display = hasWords ? "none" : "inline";
}
function updateSentenceText() {
  const words = Array.from(sentenceArea.querySelectorAll(".sentence-word")).map(
    (el) => el.dataset.word ?? ""
  );
  sentenceText.value = words.join(" ");
  refreshPlaceholder();
}
function createSentenceWord(word) {
  const wrapper = document.createElement("div");
  wrapper.className = "sentence-word";
  wrapper.dataset.word = word;
  wrapper.draggable = true;
  const textSpan = document.createElement("span");
  textSpan.textContent = word;
  wrapper.appendChild(textSpan);
  const delBtn = document.createElement("button");
  delBtn.className = "delete-word";
  delBtn.type = "button";
  delBtn.textContent = "\xD7";
  ["click", "touchstart"].forEach((eventName) => {
    delBtn.addEventListener(eventName, (event) => {
      event.stopPropagation();
      event.preventDefault();
      wrapper.remove();
      updateSentenceText();
    });
  });
  wrapper.appendChild(delBtn);
  wrapper.addEventListener("dragstart", () => {
    state.draggedElement = wrapper;
    wrapper.classList.add("dragging");
  });
  wrapper.addEventListener("dragend", () => {
    wrapper.classList.remove("dragging");
    state.draggedElement = null;
    updateSentenceText();
  });
  if (isTouchDevice) {
    wrapper.addEventListener("touchstart", () => {
      state.touchDragging = true;
      state.draggedElement = wrapper;
      wrapper.classList.add("dragging");
    });
  }
  return wrapper;
}
function getDragAfterElement(container, x) {
  const elements = Array.from(
    container.querySelectorAll(".sentence-word:not(.dragging)")
  );
  let closest = {
    offset: Number.NEGATIVE_INFINITY,
    element: null
  };
  elements.forEach((child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) {
      closest = { offset, element: child };
    }
  });
  return closest.element;
}
sentenceArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  if (!state.draggedElement) return;
  const afterElement = getDragAfterElement(sentenceArea, event.clientX);
  if (!afterElement) {
    sentenceArea.appendChild(state.draggedElement);
  } else {
    sentenceArea.insertBefore(state.draggedElement, afterElement);
  }
});
sentenceArea.addEventListener("drop", () => {
  updateSentenceText();
});
if (isTouchDevice) {
  sentenceArea.addEventListener(
    "touchmove",
    (event) => {
      if (!state.touchDragging || !state.draggedElement) return;
      const touch = event.touches[0];
      if (!touch) return;
      const afterElement = getDragAfterElement(sentenceArea, touch.clientX);
      if (!afterElement) {
        sentenceArea.appendChild(state.draggedElement);
      } else {
        sentenceArea.insertBefore(state.draggedElement, afterElement);
      }
      event.preventDefault();
    },
    { passive: false }
  );
  const endTouchDrag = () => {
    if (!state.touchDragging || !state.draggedElement) return;
    state.draggedElement.classList.remove("dragging");
    state.draggedElement = null;
    state.touchDragging = false;
    updateSentenceText();
  };
  sentenceArea.addEventListener("touchend", endTouchDrag);
  sentenceArea.addEventListener("touchcancel", endTouchDrag);
}
function renderGrid() {
  if (!state.vocabulary.length) {
    wordGrid.textContent = "Se \xEEncarc\u0103 vocabularul...";
    return;
  }
  wordGrid.innerHTML = "";
  state.vocabulary.filter(
    (entry) => state.currentCategory === "all" ? true : entry.type === state.currentCategory
  ).forEach((entry) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `word-tile ${entry.type}`;
    const emoji = entry.emoji ? `${entry.emoji} ` : "";
    tile.textContent = `${emoji}${entry.text}`;
    tile.addEventListener("click", () => {
      const node = createSentenceWord(entry.text);
      sentenceArea.appendChild(node);
      updateSentenceText();
    });
    wordGrid.appendChild(tile);
  });
}
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category ?? "all";
    state.currentCategory = category;
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderGrid();
  });
});
function loadVoices() {
  if (!("speechSynthesis" in window)) {
    return;
  }
  state.cachedVoices = window.speechSynthesis.getVoices();
  if (!state.cachedVoices.length) {
    setTimeout(loadVoices, 500);
  }
}
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}
function pickVoice() {
  if (!state.cachedVoices.length) {
    return null;
  }
  const roVoice = state.cachedVoices.find(
    (voice) => voice.lang?.toLowerCase().startsWith("ro")
  );
  return roVoice ?? state.cachedVoices[0];
}
speakBtn.addEventListener("click", () => {
  if (!("speechSynthesis" in window)) {
    alert("Browserul t\u0103u nu suport\u0103 \xEEnc\u0103 func\u021Bia de vorbire.");
    return;
  }
  const text = sentenceText.value.trim();
  if (!text) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) {
    utter.voice = voice;
  }
  utter.lang = "ro-RO";
  utter.rate = 1;
  utter.pitch = 1;
  synth.speak(utter);
});
clearBtn.addEventListener("click", () => {
  sentenceArea.innerHTML = "";
  sentenceArea.appendChild(sentencePlaceholder);
  sentencePlaceholder.style.display = "inline";
  sentenceText.value = "";
});
async function fetchVocabulary() {
  const response = await fetch("/vocab.ro.json", {
    headers: { "Cache-Control": "no-cache" }
  });
  if (!response.ok) {
    throw new Error("Nu s-a putut \xEEnc\u0103rca vocabularul.");
  }
  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Formatul vocabularului nu este valid.");
  }
  return payload;
}
async function init() {
  wordGrid.textContent = "Se \xEEncarc\u0103 vocabularul...";
  try {
    state.vocabulary = await fetchVocabulary();
  } catch (error) {
    console.error(error);
    wordGrid.innerHTML = "<p>Nu s-a putut \xEEnc\u0103rca vocabularul.</p>";
    return;
  }
  renderGrid();
  refreshPlaceholder();
}
init();
