export const CLASSIFY_PROMPT_TEMPLATE = "";
export const EXTRACT_PROMPT_TEMPLATE = "";

export function buildClassifyPrompt(text) {
  return `<|classify|>${text}`;
}

export function buildExtractPrompt(text, contentType) {
  return `<|extract|>${contentType}\n${text}`;
}
