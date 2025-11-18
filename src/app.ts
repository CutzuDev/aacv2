type WordCategory =
  | "all"
  | "pronoun"
  | "verb"
  | "descriptor"
  | "question"
  | "social"
  | "home"
  | "school"
  | "action"
  | "connector";

type VocabEntry = {
  text: string;
  type: Exclude<WordCategory, "all">;
  emoji?: string;
};

const state = {
  vocabulary: [] as VocabEntry[],
  currentCategory: "all" as WordCategory,
  draggedElement: null as HTMLDivElement | null,
  touchDragging: false,
  isSpeaking: false
};

function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" was not found in DOM.`);
  }
  return element as T;
}

const wordGrid = byId<HTMLDivElement>("wordGrid");
const sentenceArea = byId<HTMLDivElement>("sentenceArea");
const sentenceText = byId<HTMLInputElement>("sentenceText");
const sentencePlaceholder = byId<HTMLSpanElement>("sentencePlaceholder");
const speakBtn = byId<HTMLButtonElement>("speakBtn");
const clearBtn = byId<HTMLButtonElement>("clearBtn");
const categoryButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>(".category-row .btn")
);

const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  (navigator as any).msMaxTouchPoints > 0;

if (isTouchDevice) {
  document.body.classList.add("is-touch");
}

function refreshPlaceholder(): void {
  const hasWords = sentenceArea.querySelectorAll(".sentence-word").length > 0;
  sentencePlaceholder.style.display = hasWords ? "none" : "inline";
}

function updateSentenceText(): void {
  const words = Array.from(sentenceArea.querySelectorAll<HTMLElement>(".sentence-word")).map(
    (el) => el.dataset.word ?? ""
  );
  sentenceText.value = words.join(" ");
  refreshPlaceholder();
}

function createSentenceWord(word: string): HTMLDivElement {
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
  delBtn.textContent = "×";

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

function getDragAfterElement(container: HTMLElement, x: number) {
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(".sentence-word:not(.dragging)")
  );
  let closest: { offset: number; element: HTMLElement | null } = {
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

function renderGrid(): void {
  if (!state.vocabulary.length) {
    wordGrid.textContent = "Se încarcă vocabularul...";
    return;
  }

  wordGrid.innerHTML = "";

  state.vocabulary
    .filter((entry) =>
      state.currentCategory === "all"
        ? true
        : entry.type === state.currentCategory
    )
    .forEach((entry) => {
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
    const category = (button.dataset.category as WordCategory | undefined) ?? "all";
    state.currentCategory = category;
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderGrid();
  });
});



async function speakWithGemini(text: string): Promise<void> {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Eroare la generarea vocii");
  }

  const data = await response.json();
  if (!data.audio) {
    throw new Error("Nu s-a primit audio de la server");
  }

  // Convertește base64 în audio și redă
  const audioBlob = await (await fetch(`data:${data.mimeType};base64,${data.audio}`)).blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);

  await new Promise<void>((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      reject(new Error("Eroare la redarea audio"));
    };
    audio.play().catch(reject);
  });
}

speakBtn.addEventListener("click", async () => {
  const text = sentenceText.value.trim();
  if (!text || state.isSpeaking) return;

  state.isSpeaking = true;
  speakBtn.disabled = true;
  speakBtn.textContent = "🔊 Se încarcă...";

  try {
    await speakWithGemini(text);
  } catch (error) {
    console.error("Gemini TTS error:", error);
    alert(error instanceof Error ? error.message : "Eroare la generarea vocii");
  } finally {
    state.isSpeaking = false;
    speakBtn.disabled = false;
    speakBtn.innerHTML = '<span class="btn-icon">🔊</span>Vorbește';
  }
});

clearBtn.addEventListener("click", () => {
  sentenceArea.innerHTML = "";
  sentenceArea.appendChild(sentencePlaceholder);
  sentencePlaceholder.style.display = "inline";
  sentenceText.value = "";
});

async function fetchVocabulary(): Promise<VocabEntry[]> {
  const response = await fetch("/vocab.ro.json", {
    headers: { "Cache-Control": "no-cache" }
  });
  if (!response.ok) {
    throw new Error("Nu s-a putut încărca vocabularul.");
  }
  const payload = (await response.json()) as VocabEntry[];
  if (!Array.isArray(payload)) {
    throw new Error("Formatul vocabularului nu este valid.");
  }
  return payload;
}

async function init() {
  wordGrid.textContent = "Se încarcă vocabularul...";

  try {
    state.vocabulary = await fetchVocabulary();
  } catch (error) {
    console.error(error);
    wordGrid.innerHTML = "<p>Nu s-a putut încărca vocabularul.</p>";
    return;
  }

  renderGrid();
  refreshPlaceholder();
}

init();
