import type { MatchStatus } from "./types";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\d+\s*(mg|mcg|ml|g)\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s: string): string[] {
  return normalize(s).split(" ").filter((t) => t.length >= 3);
}

// Levenshtein-lite similarity for short medicine names
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const m = a.length,
    n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  const dist = dp[m][n];
  return 1 - dist / Math.max(m, n);
}

/**
 * Compare a single cart medicine (name/salt/brand) against the list of medicines
 * extracted from the prescription image. Returns a MatchStatus.
 */
export function compareMedicine(
  cart: { name: string; salt: string; brand: string },
  extracted: { name: string }[],
): MatchStatus {
  const targets = [cart.name, cart.salt, cart.brand]
    .flatMap((s) => [s, ...tokens(s)])
    .map((s) => normalize(s))
    .filter(Boolean);

  let best = 0;
  for (const e of extracted) {
    const eNorm = normalize(e.name);
    const eTokens = tokens(e.name);
    for (const t of targets) {
      const s1 = similarity(t, eNorm);
      if (s1 > best) best = s1;
      for (const et of eTokens) {
        const s2 = similarity(t, et);
        if (s2 > best) best = s2;
      }
      // Substring bonus
      if (t.length >= 4 && (eNorm.includes(t) || t.includes(eNorm))) {
        best = Math.max(best, 0.9);
      }
    }
  }
  if (best >= 0.85) return "matched";
  if (best >= 0.6) return "possible";
  return "not_found";
}
