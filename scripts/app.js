// app.js

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
generateDailyCode().then(console.log)
// Generate today's access code
async function generateDailyCode() {
  const hash = await sha256(getDailySalt());
  return hash.slice(0, CONFIG.CODE_LENGTH);
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

// Generate completion code from final word/phrase
async function generateCompletionCode(finalWord) {
  const hash = await sha256(finalWord.toUpperCase() + CONFIG.SECRET_SALT);
  return hash.slice(0, CONFIG.CODE_LENGTH);
}
