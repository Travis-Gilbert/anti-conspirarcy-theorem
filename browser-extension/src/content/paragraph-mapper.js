export function extractPageText() {
  const selector = [
    "article p",
    "article li",
    "main p",
    "main li",
    "[role='main'] p",
    "[role='main'] li",
    "p",
  ].join(",");
  const nodes = Array.from(document.querySelectorAll(selector));
  const seen = new Set();
  const segments = [];
  const chunks = [];
  let cursor = 0;

  for (const node of nodes) {
    if (seen.has(node)) {
      continue;
    }
    seen.add(node);
    const text = normalizeText(node.textContent || "");
    if (text.length < 40) {
      continue;
    }
    const charStart = cursor;
    chunks.push(text);
    cursor += text.length;
    const charEnd = cursor;
    chunks.push("\n\n");
    cursor += 2;
    segments.push({
      index: segments.length,
      text,
      char_start: charStart,
      char_end: charEnd,
      element: node,
    });
  }

  if (!segments.length) {
    const fallback = normalizeText(document.body?.innerText || "");
    return {
      text: fallback,
      segments: fallback
        ? [{
            index: 0,
            text: fallback,
            char_start: 0,
            char_end: fallback.length,
            element: document.body,
          }]
        : [],
    };
  }

  return {
    text: chunks.join("").trim(),
    segments,
  };
}

export function findSegmentForCharRange(segments, charStart = 0, charEnd = charStart) {
  let best = null;
  let bestOverlap = 0;
  for (const segment of segments || []) {
    const overlap = Math.max(
      0,
      Math.min(Number(segment.char_end), Number(charEnd)) -
        Math.max(Number(segment.char_start), Number(charStart)),
    );
    if (overlap > bestOverlap) {
      best = segment;
      bestOverlap = overlap;
    }
  }
  if (best) {
    return best;
  }
  return (segments || []).find(
    (segment) => Number(charStart) >= Number(segment.char_start) && Number(charStart) <= Number(segment.char_end),
  ) || null;
}

export function getSegmentViewportTop(segment) {
  const element = segment?.element;
  if (!element?.getBoundingClientRect) {
    return 0;
  }
  const rect = element.getBoundingClientRect();
  return Math.max(16, Math.round(rect.top));
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}
