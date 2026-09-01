// Client-side mirror of app/schemas/fields.py. These numbers must match the
// backend's MAX_NAME_LENGTH / MAX_EMAIL_LENGTH / MAX_NOTE_LENGTH — if they
// drift, the form happily accepts input the API then rejects with a 422.
export const MAX_NAME_LENGTH = 50;
export const MAX_EMAIL_LENGTH = 50;
export const MAX_NOTE_LENGTH = 100;

/** Trimmed, because the backend strips whitespace before measuring. */
export function isNameWithinLimit(value: string): boolean {
  return value.trim().length <= MAX_NAME_LENGTH;
}

export function isEmailWithinLimit(value: string): boolean {
  return value.trim().length <= MAX_EMAIL_LENGTH;
}

/** Non-empty and within the limit — the two things the backend enforces. */
export function isValidName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_NAME_LENGTH;
}

export function nameError(value: string): string | null {
  return isNameWithinLimit(value)
    ? null
    : `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
}

export function emailError(value: string): string | null {
  return isEmailWithinLimit(value)
    ? null
    : `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`;
}
