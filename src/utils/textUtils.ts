/**
 * Typlix Text Safety & Sanitization Engine
 *
 * Provides enterprise-grade input cleansing:
 * 1. HTML / Script / Event handler XSS neutralization
 * 2. Trojan Source / Unicode BiDi override stripping (CVE-2021-42574 defense)
 * 3. Invisible zero-width, non-breaking, and ASCII control character removal
 * 4. Dangerous protocol prevention (javascript:, data:text/html, vbscript:)
 * 5. Memory DOS & ReDoS length clamping
 */

export interface TextSafetyReport {
  isSafe: boolean;
  sanitized: string;
  hasHtmlTags: boolean;
  hasBidiOverrides: boolean;
  hasSuspiciousProtocols: boolean;
}

const MAX_CUSTOM_TEXT_LENGTH = 10000;

// Trojan Source Unicode BiDi override markers
const BIDI_REGEX = /[\u202A-\u202E\u2066-\u2069\u200E\u200F]/g;

// Dangerous script execution protocols
const DANGEROUS_PROTOCOLS_REGEX = /(javascript|vbscript|data\s*:\s*text\/html)\s*:/gi;

// Unsafe HTML tags and script elements
const HTML_TAG_REGEX = /<[^>]*>?/gm;

// Non-printable control characters (excluding standard whitespace)
const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/**
 * Validates whether raw input contains malicious code, BiDi attacks, or unescaped HTML.
 */
export function validateTextSafety(raw: string): TextSafetyReport {
  if (!raw) {
    return {
      isSafe: true,
      sanitized: '',
      hasHtmlTags: false,
      hasBidiOverrides: false,
      hasSuspiciousProtocols: false,
    };
  }

  const hasHtmlTags = HTML_TAG_REGEX.test(raw);
  const hasBidiOverrides = BIDI_REGEX.test(raw);
  const hasSuspiciousProtocols = DANGEROUS_PROTOCOLS_REGEX.test(raw);
  const isSafe = !hasHtmlTags && !hasBidiOverrides && !hasSuspiciousProtocols;

  return {
    isSafe,
    sanitized: sanitizeCustomText(raw),
    hasHtmlTags,
    hasBidiOverrides,
    hasSuspiciousProtocols,
  };
}

/**
 * Sanitizes and normalizes arbitrary text (such as custom pasted text,
 * quotes from external sources, or web articles) into clean, typable text.
 */
export function sanitizeCustomText(raw: string): string {
  if (!raw) return '';

  return raw
    // 1. Length clamping to prevent memory freeze / DoS
    .slice(0, MAX_CUSTOM_TEXT_LENGTH)
    // 2. Strip HTML tags and script blocks
    .replace(HTML_TAG_REGEX, ' ')
    // 3. Strip dangerous protocol markers
    .replace(DANGEROUS_PROTOCOLS_REGEX, '')
    // 4. Strip BiDi override characters (Trojan Source mitigation)
    .replace(BIDI_REGEX, '')
    // 5. Strip non-printable ASCII control characters
    .replace(CONTROL_CHARS_REGEX, '')
    // 6. Normalize line breaks & tabs to single spaces
    .replace(/\r\n/g, ' ')
    .replace(/[\r\n\t]/g, ' ')
    // 7. Replace typographic / curly quotes with standard ASCII
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    // 8. Replace em-dash and en-dash with standard hyphen
    .replace(/[\u2013\u2014]/g, '-')
    // 9. Replace non-breaking spaces and zero-width characters
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // 10. Collapse multiple consecutive spaces into one
    .replace(/ {2,}/g, ' ')
    .trim();
}
