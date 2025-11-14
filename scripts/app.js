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

// Generate today's access code
async function generateDailyCode() {
  const hash = await sha256(getDailySalt());
  return hash.slice(0, CONFIG.CODE_LENGTH);
}

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

// Generate completion code from final word/phrase
async function generateCompletionCode(finalWord) {
  const epoch = Date.now(); // unique per player
  const input = finalWord.toUpperCase() + epoch + CONFIG.SECRET_SALT;
  const hash = await sha256(input);
  return hash.slice(0, CONFIG.CODE_LENGTH);
}

