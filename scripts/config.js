const CONFIG = {
  BASE_PATH: window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
    ? "/"
    : "/qr-hunt/",   // your GitHub Pages repo folder
  SECRET_SALT: "YOUR_SECRET_SALT",
  CODE_LENGTH: 8,
  LETTER_MAP: {
    "QR001": "U",
    "QR002": "N",
    "QR003": "I",
    "QR001": "Q",
    "QR004": "U",
    "QR005": "E",
    "QR006": "*",
    "QR007": "*",
    "QR003": "*",
    "QR008": "*",
    "QR009": "*",
    "QR010": "*"
  },
  HIDDEN_PHRASE: "UNIQUE",
  ADMIN_SALT: "YOUR_ADMIN_SALT",
  ADMIN_PIN_LENGTH: 6
};
