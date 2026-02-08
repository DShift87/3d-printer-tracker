/**
 * Parse OCR text to extract print time (minutes) and price (number).
 * Handles common formats from printer displays, slicers, receipts, etc.
 */

export interface ParsedFromImage {
  printTimeMinutes: number | null;
  price: number | null;
  weightGrams: number | null;
  rawText: string;
}

/** Match print time: "2h 35m", "2h 35 min", "155 min", "2:35", "2h", "35m" */
function parsePrintTime(text: string): number | null {
  const lines = text.split(/\s*\n\s*/);
  const joined = text.replace(/\s+/g, " ");

  // Pattern: Xh Ym or Xh Y min
  const hMinMatch = joined.match(/(\d+)\s*h(?:our)?s?\s*(\d+)\s*m(?:in)?/i) ||
    joined.match(/(\d+)\s*:\s*(\d+)\s*(?:h|m|min)/i) ||
    joined.match(/(\d+)\s*h\s*(\d+)\s*m/i);
  if (hMinMatch) {
    const h = parseInt(hMinMatch[1], 10);
    const m = parseInt(hMinMatch[2], 10);
    if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
  }

  // Pattern: Xh (hours only)
  const hOnly = joined.match(/(\d+)\s*h(?:our)?s?(?:\s|$|m)/i);
  if (hOnly) {
    const h = parseInt(hOnly[1], 10);
    if (!isNaN(h)) return h * 60;
  }

  // Pattern: Xm or X min (minutes only)
  const mOnly = joined.match(/(\d+)\s*m(?:in)?(?:\s|$)/i) || joined.match(/(\d+)\s*minutes?/i);
  if (mOnly) {
    const m = parseInt(mOnly[1], 10);
    if (!isNaN(m)) return m;
  }

  // Pattern: X:YY (e.g. 2:35)
  const colonMatch = joined.match(/(\d+)\s*:\s*(\d+)(?:\s|$|m|h)/);
  if (colonMatch) {
    const h = parseInt(colonMatch[1], 10);
    const m = parseInt(colonMatch[2], 10);
    if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
  }

  return null;
}

/** Match price: $24.99, $6.99, 24.99, €10.50 */
function parsePrice(text: string): number | null {
  const joined = text.replace(/\s+/g, " ");
  // Match $X.XX or X.XX (with at least one decimal)
  const match = joined.match(/[$€£]?\s*(\d+[.,]\d{2})(?:\s|$|[^\d])/);
  if (match) {
    const num = parseFloat(match[1].replace(",", "."));
    return isNaN(num) ? null : num;
  }
  return null;
}

/** Match weight: 25g, 25 g, 50.5g, 0.5kg, 100 grams, filament used: 25.3g, etc. */
function parseWeight(text: string): number | null {
  const joined = text.replace(/\s+/g, " ").toLowerCase();
  const toNum = (s: string) => {
    const n = parseFloat(s.replace(",", "."));
    return isNaN(n) ? null : n;
  };

  // Weight/filament/used context: "weight: 25.3g", "filament used: 25g", "used: 25.3 g"
  const contextMatch = joined.match(/(?:weight|filament|used|material)\s*:?\s*(\d+(?:[.,]\d+)?)\s*[gq9]?(?:ram)?s?(?:\s|$|[^\w])/i) ||
    joined.match(/(?:weight|filament|used|material)\s*:?\s*(\d+(?:[.,]\d+)?)\s*(?:g|grams?)/i);
  if (contextMatch) {
    const num = toNum(contextMatch[1]);
    if (num != null && num < 10000) return num; // sanity: avoid huge numbers
  }

  // Xg, X g, X.XXg (grams) - also OCR may read g as q or 9
  const gMatch = joined.match(/(\d+(?:[.,]\d+)?)\s*[gq9](?:ram)?s?(?:\s|$|[^\w])/i) ||
    joined.match(/(\d+(?:[.,]\d+)?)\s*g(?:ram)?s?(?:\s|$|[^\w])/i);
  if (gMatch) {
    const num = toNum(gMatch[1]);
    if (num != null && num < 10000) return num;
  }

  // "X grams", "X gram"
  const gramsMatch = joined.match(/(\d+(?:[.,]\d+)?)\s*grams?/i);
  if (gramsMatch) {
    const num = toNum(gramsMatch[1]);
    if (num != null && num < 10000) return num;
  }

  // Xkg (kilograms -> grams)
  const kgMatch = joined.match(/(\d+(?:[.,]\d+)?)\s*kg(?:\s|$|[^\w])/i);
  if (kgMatch) {
    const num = toNum(kgMatch[1]);
    if (num != null && num < 100) return num * 1000;
  }

  // Bare number before "g" with optional OCR noise: "25.39" when it's "25.3g"
  const bareMatch = joined.match(/(\d{1,2}(?:[.,]\d{1,2})?)\s*g\b/i);
  if (bareMatch) {
    const num = toNum(bareMatch[1]);
    if (num != null && num > 0 && num < 1000) return num;
  }

  return null;
}

export function parseOcrText(text: string): ParsedFromImage {
  return {
    printTimeMinutes: parsePrintTime(text),
    price: parsePrice(text),
    weightGrams: parseWeight(text),
    rawText: text,
  };
}
