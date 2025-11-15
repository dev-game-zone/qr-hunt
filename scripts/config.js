const CONFIG = {
   BASE_PATH: window.location.hostname === "127.0.0.1" || 
             window.location.hostname === "localhost"
             ? "/"
             : "/qr-hunt/",   // your GitHub Pages repo folder
  SECRET_SALT: "YOUR_SECRET_SALT",
  CODE_LENGTH: 8,
  LETTER_MAP: {
    "QR001": "D",
    "QR002": "A",
    "QR003": "N",
    "QR001": "D",
    "QR004": "E",
    "QR005": "L",
    "QR006": "I",
    "QR007": "O",
    "QR003": "N",
    "QR008": "*",
    "QR009": "*",
    "QR010": "*"
  },
  HIDDEN_PHRASE: "DANDELION",
  ADMIN_SALT: "YOUR_ADMIN_SALT",
  ADMIN_PIN_LENGTH: 6
};
