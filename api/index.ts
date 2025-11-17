import vocab from "../vocab.ro.json";

const vocabJson = JSON.stringify(vocab).replace(/</g, "\\u003c");

const html = `<!doctype html>
<html lang="ro">
  <head>
    <meta charset="utf-8" />
    <title>Sistem AAC – Română</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        --bg: #f5f6fb;
        --surface: #ffffff;
        --primary: #4b6bff;
        --primary-dark: #3242b8;
        --danger: #f14b4b;
        --accent: #ffd36b;
        --text-main: #1f2933;
        --text-muted: #6b7280;
        --border-subtle: #e5e7eb;
        --tile-pronoun: #fff6d5;
        --tile-verb: #e4f8e7;
        --tile-descriptor: #e8f0ff;
        --tile-question: #ffe9f0;
        --tile-social: #f4e8ff;
        --tile-home: #ffe9d5;
        --tile-school: #e6fff2;
        --tile-action: #fff0f6;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
        background: radial-gradient(
          circle at top,
          #e9efff 0,
          #f5f6fb 40%
        );
        min-height: 100vh;
        color: var(--text-main);
      }

      .page {
        max-width: 1100px;
        margin: 24px auto;
        padding: 16px;
      }

      .card {
        background: var(--surface);
        border-radius: 24px;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
        padding: 24px 24px 28px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 28px;
        text-align: center;
        letter-spacing: 0.02em;
      }

      .subtitle {
        text-align: center;
        font-size: 14px;
        color: var(--text-muted);
        margin-bottom: 20px;
      }

      .sentence-shell {
        border-radius: 18px;
        border: 1px solid #d1d5db;
        background: #f9fafb;
        padding: 12px 16px 10px;
        margin-bottom: 14px;
      }

      .sentence-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--text-muted);
        margin-bottom: 4px;
      }

      .sentence-input {
        width: 100%;
        border: none;
        outline: none;
        background: transparent;
        font-size: 20px;
        font-weight: 500;
        color: var(--text-main);
      }

      .sentence-input::placeholder {
        color: #cbd5e1;
      }

      .top-row {
        display: flex;
        gap: 12px;
        margin-bottom: 18px;
        flex-wrap: wrap;
      }

      .btn {
        border-radius: 999px;
        border: none;
        cursor: pointer;
        padding: 10px 18px;
        font-size: 15px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: background 0.15s ease, transform 0.05s ease,
          box-shadow 0.15s ease;
        white-space: nowrap;
      }

      .btn-primary {
        background: var(--primary);
        color: white;
        box-shadow: 0 10px 25px rgba(37, 99, 235, 0.45);
      }

      .btn-primary:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
      }

      .btn-danger {
        background: #fee2e2;
        color: #b91c1c;
      }

      .btn-danger:hover {
        background: #fecaca;
      }

      .btn-secondary {
        background: #e5e7eb;
        color: #111827;
      }

      .btn-secondary.active {
        background: var(--primary);
        color: white;
      }

      .btn-icon {
        font-size: 17px;
      }

      .category-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
      }

      .category-row .btn {
        flex: 1 1 120px;
        justify-content: center;
      }

      .content-row {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .sentence-area {
        min-height: 70px;
        border-radius: 16px;
        border: 1px dashed #cbd5e1;
        background: #f8fafc;
        padding: 10px;
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }

      .sentence-placeholder {
        color: #94a3b8;
        font-size: 14px;
      }

      .sentence-word {
        position: relative;
        padding: 10px 30px 10px 14px;
        border-radius: 14px;
        background: white;
        border: 1px solid #cbd5e1;
        cursor: grab;
        box-shadow: 0 5px 12px rgba(15, 23, 42, 0.12);
        font-size: 16px;
        font-weight: 600;
        user-select: none;
        display: inline-flex;
        align-items: center;
      }

      .sentence-word.dragging {
        opacity: 0.6;
        box-shadow: 0 0 0 2px var(--primary);
      }

      .sentence-word .delete-word {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        border: none;
        background: rgba(248, 113, 113, 0.95);
        color: white;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.12s ease, transform 0.12s ease;
      }

      .sentence-word:hover .delete-word {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(-1px);
      }

      body.is-touch .sentence-word .delete-word {
        opacity: 1;
        pointer-events: auto;
      }

      .word-grid-shell {
        border-radius: 18px;
        border: 1px solid var(--border-subtle);
        background: #f9fafb;
        padding: 10px;
        max-height: 430px;
        overflow: auto;
      }

      .word-grid {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 8px;
      }

      .word-tile {
        border-radius: 14px;
        padding: 8px 6px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid #d1d5db;
        background: white;
        transition: transform 0.05s ease, box-shadow 0.12s ease,
          border-color 0.12s ease, background 0.12s ease;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .word-tile.pronoun {
        background: var(--tile-pronoun);
      }

      .word-tile.verb {
        background: var(--tile-verb);
      }

      .word-tile.descriptor {
        background: var(--tile-descriptor);
      }

      .word-tile.question {
        background: var(--tile-question);
      }

      .word-tile.social {
        background: var(--tile-social);
      }

      .word-tile.home {
        background: var(--tile-home);
      }

      .word-tile.school {
        background: var(--tile-school);
      }

      .word-tile.action {
        background: var(--tile-action);
      }

      .word-tile:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 16px rgba(15, 23, 42, 0.2);
        border-color: var(--primary);
      }

      .word-tile:active {
        transform: translateY(0);
        box-shadow: none;
      }

      .grid-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 6px;
        padding: 0 2px;
      }

      .grid-header-title {
        font-size: 15px;
        font-weight: 600;
      }

      .grid-header-hint {
        font-size: 12px;
        color: var(--text-muted);
      }

      @media (max-width: 900px) {
        .word-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        h1 {
          font-size: 22px;
        }

        .card {
          padding: 18px 14px 22px;
        }

        .sentence-word {
          font-size: 15px;
        }

        .word-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .category-row .btn {
          flex: 1 1 45%;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="card">
        <h1>Sistem AAC – Română</h1>
        <p class="subtitle">
          Construiește propoziții în română folosind cuvinte și emoji.
          Cuvintele se pot rearanja prin drag and drop.
        </p>

        <div class="sentence-shell">
          <div class="sentence-label">Propoziția ta</div>
          <input
            id="sentenceText"
            class="sentence-input"
            type="text"
            placeholder="Construiește o propoziție..."
            readonly
          />
        </div>

        <div class="top-row">
          <button id="speakBtn" class="btn btn-primary">
            <span class="btn-icon">🔊</span>
            Vorbește
          </button>
          <button id="clearBtn" class="btn btn-danger">
            Șterge propoziția
          </button>
        </div>

        <div class="category-row">
          <button
            class="btn btn-secondary active"
            data-category="all"
            id="cat-all"
          >
            Toate
          </button>
          <button class="btn btn-secondary" data-category="pronoun">
            Pronume
          </button>
          <button class="btn btn-secondary" data-category="verb">
            Verbe
          </button>
          <button class="btn btn-secondary" data-category="descriptor">
            Descrieri
          </button>
          <button class="btn btn-secondary" data-category="question">
            Întrebări
          </button>
          <button class="btn btn-secondary" data-category="social">
            Social
          </button>
          <button class="btn btn-secondary" data-category="home">
            Acasă
          </button>
          <button class="btn btn-secondary" data-category="school">
            Școală
          </button>
          <button class="btn btn-secondary" data-category="action">
            Acțiuni
          </button>
        </div>

        <div class="content-row">
          <div id="sentenceArea" class="sentence-area">
            <span id="sentencePlaceholder" class="sentence-placeholder">
              Apasă pe un cuvânt pentru a-l adăuga aici. Poți reordona cu drag
              and drop.
            </span>
          </div>

          <div class="word-grid-shell">
            <div class="grid-header">
              <div class="grid-header-title">Cuvinte</div>
              <div class="grid-header-hint">
                Apasă pentru a adăuga. Trage pentru a rearanja.
              </div>
            </div>
            <div id="wordGrid" class="word-grid"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- vocabularul este injectat aici în format JSON -->
    <script id="vocab-json" type="application/json">
${vocabJson}
    </script>

    <script>
      (function () {
        const vocabulary = JSON.parse(
          document.getElementById("vocab-json").textContent || "[]"
        );

        const wordGrid = document.getElementById("wordGrid");
        const sentenceArea = document.getElementById("sentenceArea");
        const sentenceText = document.getElementById("sentenceText");
        const sentencePlaceholder = document.getElementById(
          "sentencePlaceholder"
        );
        const speakBtn = document.getElementById("speakBtn");
        const clearBtn = document.getElementById("clearBtn");
        const categoryButtons = document.querySelectorAll(
          ".category-row .btn"
        );

        const isTouchDevice =
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0;

        if (isTouchDevice) {
          document.body.classList.add("is-touch");
        }

        let currentCategory = "all";
        let draggedElement = null;
        let touchDragging = false;
        let cachedVoices = [];

        function refreshPlaceholder() {
          const hasWords =
            sentenceArea.querySelectorAll(".sentence-word").length > 0;
          sentencePlaceholder.style.display = hasWords ? "none" : "inline";
        }

        function updateSentenceText() {
          const words = Array.from(
            sentenceArea.querySelectorAll(".sentence-word")
          ).map(function (el) {
            return el.getAttribute("data-word") || "";
          });
          sentenceText.value = words.join(" ");
          refreshPlaceholder();
        }

        function createSentenceWord(word) {
          const wrapper = document.createElement("div");
          wrapper.className = "sentence-word";
          wrapper.setAttribute("data-word", word);
          wrapper.draggable = true;

          const textSpan = document.createElement("span");
          textSpan.textContent = word;
          wrapper.appendChild(textSpan);

          const delBtn = document.createElement("button");
          delBtn.className = "delete-word";
          delBtn.type = "button";
          delBtn.textContent = "×";

          ["click", "touchstart"].forEach(function (evt) {
            delBtn.addEventListener(evt, function (ev) {
              ev.stopPropagation();
              ev.preventDefault();
              wrapper.remove();
              updateSentenceText();
            });
          });

          wrapper.appendChild(delBtn);

          wrapper.addEventListener("dragstart", function () {
            draggedElement = wrapper;
            wrapper.classList.add("dragging");
          });

          wrapper.addEventListener("dragend", function () {
            wrapper.classList.remove("dragging");
            draggedElement = null;
            updateSentenceText();
          });

          if (isTouchDevice) {
            wrapper.addEventListener("touchstart", function () {
              touchDragging = true;
              draggedElement = wrapper;
              wrapper.classList.add("dragging");
            });
          }

          return wrapper;
        }

        function getDragAfterElement(container, x) {
          const elements = Array.from(
            container.querySelectorAll(".sentence-word:not(.dragging)")
          );
          let closest = { offset: Number.NEGATIVE_INFINITY, element: null };

          elements.forEach(function (child) {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
              closest = { offset: offset, element: child };
            }
          });

          return closest.element;
        }

        sentenceArea.addEventListener("dragover", function (ev) {
          ev.preventDefault();
          if (!draggedElement) return;
          const afterElement = getDragAfterElement(sentenceArea, ev.clientX);
          if (afterElement == null) {
            sentenceArea.appendChild(draggedElement);
          } else {
            sentenceArea.insertBefore(draggedElement, afterElement);
          }
        });

        sentenceArea.addEventListener("drop", function () {
          updateSentenceText();
        });

        if (isTouchDevice) {
          sentenceArea.addEventListener(
            "touchmove",
            function (ev) {
              if (!touchDragging || !draggedElement) return;
              const touch = ev.touches[0];
              if (!touch) return;
              const afterElement = getDragAfterElement(
                sentenceArea,
                touch.clientX
              );
              if (afterElement == null) {
                sentenceArea.appendChild(draggedElement);
              } else {
                sentenceArea.insertBefore(draggedElement, afterElement);
              }
              ev.preventDefault();
            },
            { passive: false }
          );

          function endTouchDrag() {
            if (!touchDragging || !draggedElement) return;
            draggedElement.classList.remove("dragging");
            draggedElement = null;
            touchDragging = false;
            updateSentenceText();
          }

          sentenceArea.addEventListener("touchend", endTouchDrag);
          sentenceArea.addEventListener("touchcancel", endTouchDrag);
        }

        function renderGrid() {
          wordGrid.innerHTML = "";
          vocabulary
            .filter(function (w) {
              return currentCategory === "all"
                ? true
                : w.type === currentCategory;
            })
            .forEach(function (w) {
              const tile = document.createElement("button");
              tile.type = "button";
              tile.className = "word-tile " + w.type;
              const emoji = w.emoji ? w.emoji + " " : "";
              tile.textContent = emoji + w.text;

              tile.addEventListener("click", function () {
                const node = createSentenceWord(w.text);
                sentenceArea.appendChild(node);
                updateSentenceText();
              });

              wordGrid.appendChild(tile);
            });
        }

        categoryButtons.forEach(function (btn) {
          btn.addEventListener("click", function () {
            const cat = btn.getAttribute("data-category");
            if (!cat) return;

            currentCategory = cat;
            categoryButtons.forEach(function (b) {
              b.classList.remove("active");
            });
            btn.classList.add("active");
            renderGrid();
          });
        });

        function loadVoices() {
          const synth = window.speechSynthesis;
          cachedVoices = synth.getVoices();
          if (!cachedVoices || cachedVoices.length === 0) {
            setTimeout(loadVoices, 500);
          }
        }

        if ("speechSynthesis" in window) {
          window.speechSynthesis.onvoiceschanged = loadVoices;
          loadVoices();
        }

        function pickVoice() {
          if (!cachedVoices || cachedVoices.length === 0) return null;

          const roVoices = cachedVoices.filter(function (v) {
            return v.lang && v.lang.toLowerCase().startsWith("ro");
          });

          if (roVoices.length > 0) {
            return roVoices[0];
          }

          return cachedVoices[0];
        }

        speakBtn.addEventListener("click", function () {
          if (!("speechSynthesis" in window)) {
            alert(
              "Browserul tău nu suportă încă funcția de vorbire."
            );
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

        clearBtn.addEventListener("click", function () {
          sentenceArea.innerHTML = "";
          sentenceArea.appendChild(sentencePlaceholder);
          sentencePlaceholder.style.display = "inline";
          sentenceText.value = "";
        });

        renderGrid();
        refreshPlaceholder();
      })();
    </script>
  </body>
</html>
`;

// Export handler pentru Vercel
export default function handler(_req: Request): Response {
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

// Development server (opțional, doar pentru local)
if (typeof Bun !== "undefined" && import.meta.main) {
  const server = Bun.serve({
    port: 3000,
    fetch: handler
  });

  const host = (server as any).hostname ?? "localhost";
  console.log(`AAC dashboard running at http://${host}:${server.port}`);
}