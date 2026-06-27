import * as SecureStore from 'expo-secure-store';

// ─── WHY THIS FILE EXISTS ─────────────────────────────────────────────────────
// @clerk/clerk-expo@0.20.36 has a bug: it throws
//   "Not a valid base64 encoded string length"
// when it tries to decode a stored token that is malformed or incomplete.
// This happens because:
//   1. A previous failed sign-up/sign-in left a partial token in SecureStore
//   2. Clerk reads it on app launch and crashes before showing the login screen
//
// This cache validates every token before returning it to Clerk.
// Corrupted tokens are silently deleted → Clerk starts a clean session.
// ─────────────────────────────────────────────────────────────────────────────

function isValidBase64(str) {
  if (!str || typeof str !== 'string') return false;
  try {
    // Clerk tokens are JWTs: three dot-separated base64url segments
    // We accept any string that survives atob() after padding correction
    const parts = str.includes('.') ? str.split('.') : [str];
    parts.forEach(part => {
      if (!part) return;
      const clean  = part.replace(/-/g, '+').replace(/_/g, '/');
      const padded = clean + '='.repeat((4 - clean.length % 4) % 4);
      atob(padded);
    });
    return true;
  } catch {
    return false;
  }
}

export const tokenCache = {
  async getToken(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (!value) return null;

      // If stored value is corrupted, delete it and return null
      // so Clerk shows login screen instead of crashing
      if (!isValidBase64(value)) {
        console.log(`[tokenCache] Deleting corrupted token for key: ${key}`);
        await SecureStore.deleteItemAsync(key);
        return null;
      }

      return value;
    } catch {
      return null;
    }
  },

  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Silent fail — user will need to log in again next session
    }
  },

  async clearToken(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {}
  },
};
