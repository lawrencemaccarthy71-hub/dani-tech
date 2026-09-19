/**
 * auth.ts — Dani Tech Admin Authentication Utilities
 *
 * Uses the browser-native Web Crypto API (SHA-256) to verify
 * passwords without storing plain text anywhere in the code.
 *
 * Default credentials:
 *   Password: Accraacademy27$
 *   ⚠️ Change via Settings panel → saves a new hash to localStorage
 */

// SHA-256 hash of the default password "Accraacademy27$"
const DEFAULT_PASSWORD_HASH =
  '483650a35d9bf7f38119d702abc81efc8356efec0f7b048ead7045b747b95cb1';

const SESSION_KEY = 'danitech_admin_session';
const CUSTOM_HASH_KEY = 'danitech_admin_hash';
const SESSION_TOKEN = 'dt_auth_v1_authenticated';

// Brute-force lockout constants
const LOCKOUT_KEY = 'danitech_admin_lockout';
const LOCKOUT_ATTEMPTS = 5;      // Max failed attempts before lockout
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes in ms

// Session timeout: 2 hours of inactivity
const ACTIVITY_KEY = 'danitech_admin_activity';
const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours in ms

/** Hashes a plain-text string using SHA-256, returns a lowercase hex string. */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Returns the active password hash (custom override takes priority over default). */
function getActiveHash(): string {
  return localStorage.getItem(CUSTOM_HASH_KEY) || DEFAULT_PASSWORD_HASH;
}

// ─── Brute-Force Lockout ─────────────────────────────────────────────────────

interface LockoutState {
  attempts: number;
  lockedUntil: number | null; // Unix timestamp in ms, or null if not locked
}

function getLockoutState(): LockoutState {
  try {
    const raw = sessionStorage.getItem(LOCKOUT_KEY);
    return raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: null };
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

function saveLockoutState(state: LockoutState): void {
  sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify(state));
}

/** Returns remaining lockout time in ms, or 0 if not locked. */
export function getLockoutRemainingMs(): number {
  const state = getLockoutState();
  if (state.lockedUntil === null) return 0;
  const remaining = state.lockedUntil - Date.now();
  if (remaining <= 0) {
    // Lockout has expired — clear it
    saveLockoutState({ attempts: 0, lockedUntil: null });
    return 0;
  }
  return remaining;
}

/** Returns true if the login is currently locked out. */
export function isLockedOut(): boolean {
  return getLockoutRemainingMs() > 0;
}

function recordFailedAttempt(): void {
  const state = getLockoutState();
  const newAttempts = state.attempts + 1;
  if (newAttempts >= LOCKOUT_ATTEMPTS) {
    saveLockoutState({ attempts: newAttempts, lockedUntil: Date.now() + LOCKOUT_DURATION_MS });
  } else {
    saveLockoutState({ attempts: newAttempts, lockedUntil: null });
  }
}

function clearLockout(): void {
  sessionStorage.removeItem(LOCKOUT_KEY);
}

// ─── Session Timeout ─────────────────────────────────────────────────────────

/** Updates the last-activity timestamp. Call on any admin interaction. */
export function touchAdminActivity(): void {
  sessionStorage.setItem(ACTIVITY_KEY, Date.now().toString());
}

/** Checks whether the session has timed out due to inactivity. */
function isSessionTimedOut(): boolean {
  const raw = sessionStorage.getItem(ACTIVITY_KEY);
  if (!raw) return true;
  return Date.now() - parseInt(raw, 10) > SESSION_TIMEOUT_MS;
}

// ─── Core Auth API ───────────────────────────────────────────────────────────

/**
 * Verifies the given plain-text password against the stored hash.
 * Enforces brute-force lockout.
 * Returns true if it matches, false otherwise.
 */
export async function verifyPassword(input: string): Promise<boolean> {
  if (isLockedOut()) return false;

  const inputHash = await hashPassword(input);
  const isMatch = inputHash === getActiveHash();

  if (isMatch) {
    clearLockout();
  } else {
    recordFailedAttempt();
  }

  return isMatch;
}

/**
 * Updates the admin password by storing a new SHA-256 hash in localStorage.
 * Call this only after verifying the current password first.
 */
export async function updateAdminPassword(newPassword: string): Promise<void> {
  const newHash = await hashPassword(newPassword);
  localStorage.setItem(CUSTOM_HASH_KEY, newHash);
}

/** Writes a session token to sessionStorage (clears on tab/browser close). */
export function setAdminSession(): void {
  sessionStorage.setItem(SESSION_KEY, SESSION_TOKEN);
  touchAdminActivity();
}

/** Removes the admin session, effectively logging the admin out. */
export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(ACTIVITY_KEY);
}

/** Returns true if a valid admin session exists and has not timed out. */
export function isAdminAuthenticated(): boolean {
  const hasToken = sessionStorage.getItem(SESSION_KEY) === SESSION_TOKEN;
  if (!hasToken) return false;

  if (isSessionTimedOut()) {
    clearAdminSession();
    return false;
  }

  touchAdminActivity(); // Refresh on every check
  return true;
}
