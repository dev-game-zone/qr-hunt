// app.js (updated secure version)

// SHA-256 hashing
async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

// Get UTC-based daily salt
function getDailySalt() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}${CONFIG.SECRET_SALT}`;
}

// Generate today's access code
async function generateDailyCode() {
  const hash = await sha256(getDailySalt());
  return hash.slice(0, CONFIG.CODE_LENGTH);
}

// Generate today's admin pin
async function generateDailyAdminPin() {
  const hash = await sha256(getDailySalt() + CONFIG.ADMIN_SALT);
  return hash.slice(0, CONFIG.ADMIN_PIN_LENGTH);
}

// Verify access code entered by player
async function verifyAccessCode(input) {
  const today = await generateDailyCode();
  return input.trim().toUpperCase() === today;
}

// Letter storage using localStorage
const store = {
  get letters() {
    return JSON.parse(localStorage.getItem("letters") || "[]");
  },
  add(letter) {
    const letters = store.letters;
    if (!letters.includes(letter)) {
      letters.push(letter);
      localStorage.setItem("letters", JSON.stringify(letters));
    }
  },
  reset() {
    localStorage.removeItem("letters");
  }
};

// Completion lock + code storage
const progress = {
  isCompleted() {
    return localStorage.getItem("completed") === "yes";
  },
  setCompleted() {
    localStorage.setItem("completed", "yes");
  },
  clearCompleted() {
    localStorage.removeItem("completed");
  },

  getCompletionCode() {
    return localStorage.getItem("completion_code") || null;
  },
  setCompletionCode(code) {
    localStorage.setItem("completion_code", code);
  },
  clearCompletionCode() {
    localStorage.removeItem("completion_code");
  },

  // Ensures legacy and current states stay consistent
  ensureConsistency() {
    const completed = this.isCompleted();
    const code = this.getCompletionCode();

    // Case 1: completed=yes but no code stored (legacy)
    if (completed && !code) {
      // Generate a synthetic code so the admin can still verify
      const synthetic = "LEGACY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      this.setCompletionCode(synthetic);
    }

    // Case 2: code exists but completed flag is missing (rare but could happen)
    if (!completed && code) {
      this.setCompleted();
    }
  }
};

// Run consistency check once on script load
progress.ensureConsistency();


// Generate completion code and lock progress
async function generateCompletionCode(finalWord) {
  // Re-check consistency in case older users hit this function
  progress.ensureConsistency();

  const saved = progress.getCompletionCode();
  if (saved) return saved;

  const epoch = Date.now();
  const input = finalWord.toUpperCase() + epoch + CONFIG.SECRET_SALT;
  const hash = await sha256(input);
  const code = hash.slice(0, CONFIG.CODE_LENGTH);

  progress.setCompletionCode(code);
  progress.setCompleted();

  return code;
}
