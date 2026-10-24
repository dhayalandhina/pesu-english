// Gemini text API on the local server (via the official SDK).
import { GoogleGenAI } from '@google/genai';
import { classifyError, errText, genJSONWith } from '../public/core/util.js';

export { classifyError } from '../public/core/util.js';

export function makeAI(apiKey) {
  const baseUrl = process.env.PESU_GEMINI_BASE_URL; // only used by the offline test harness
  return new GoogleGenAI(baseUrl ? { apiKey, httpOptions: { baseUrl } } : { apiKey });
}

export function genJSON(ai, models, prompt, { temperature = 0.3, maxOutputTokens = 2048 } = {}) {
  return genJSONWith(async (model, jsonMode) => {
    const config = { temperature, maxOutputTokens };
    if (jsonMode) config.responseMimeType = 'application/json';
    const res = await ai.models.generateContent({ model, contents: prompt, config });
    return res.text;
  }, models, prompt);
}

export async function validateKey(apiKey) {
  const ai = makeAI(apiKey);
  try {
    const pager = await ai.models.list({ config: { pageSize: 50 } });
    const names = [];
    for (const m of pager.page || []) names.push(String(m.name || '').replace(/^models\//, ''));
    return { ok: true, models: names };
  } catch (e) {
    return { ok: false, kind: classifyError(e), detail: errText(e).slice(0, 300) };
  }
}
