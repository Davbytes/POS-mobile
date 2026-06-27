// src/shims/base64Patch.js
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function lenientAtob(input) {
  if (input == null) return '';
  let str = String(input).replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  while (str.length % 4 !== 0) str += '=';
  const raw = str.replace(/=+$/, '');
  let result = '', buffer = 0, bitsCollected = 0;
  for (const ch of raw) {
    const idx = CHARS.indexOf(ch);
    if (idx < 0) continue;
    buffer = (buffer << 6) | idx;
    bitsCollected += 6;
    if (bitsCollected >= 8) {
      bitsCollected -= 8;
      result += String.fromCharCode((buffer >> bitsCollected) & 0xff);
    }
  }
  return result;
}

// Unconditional — overwrites both RN's native atob AND the base-64 polyfill
global.atob = lenientAtob;
globalThis.atob = lenientAtob;