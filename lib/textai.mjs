// AI client on the local server: Gemini (official SDK), OpenAI or Groq (shared adapters), picked by the key.
import { GoogleGenAI } from '@google/genai';
import WebSocket from 'ws';
import { classifyError, errText, genJSONWith } from '../public/core/util.js';
import { providerOf } from '../public/core/state.js';
import { makeOpenAI } from '../public/core/openai.js';
import { makeGroq } from '../public/core/groq.js';

export { classifyError } from '../public/core/util.js';

// Node can send the key as a normal header
const nodeSocket = (url, key) => new WebSocket(url, { headers: { Authorization: `Bearer ${key}` } });

export function makeAI(apiKey) {
  if (providerOf(apiKey) === 'groq') return makeGroq(apiKey, { baseUrl: process.env.PESU_GROQ_BASE_URL || undefined });
  if (providerOf(apiKey) === 'openai') {
    return makeOpenAI(apiKey, { baseUrl: process.env.PESU_OPENAI_BASE_URL || undefined, openSocket: nodeSocket });
  }
  const baseUrl = process.env.PESU_GEMINI_BASE_URL; // only used by the offline test harness
  return new GoogleGenAI(baseUrl ? { apiKey, httpOptions: { baseUrl } } : { apiKey });
}

export function genJSON(ai, models, prompt, { temperature = 0.3, maxOutputTokens = 2048 } = {}) {
  if (typeof ai.genJSON === 'function') return ai.genJSON(models, prompt, { maxOutputTokens });
  return genJSONWith(async (model, jsonMode) => {
    const config = { temperature, maxOutputTokens };
    if (jsonMode) config.responseMimeType = 'application/json';
    const res = await ai.models.generateContent({ model, contents: prompt, config });
    return res.text;
  }, models, prompt);
}

export async function validateKey(apiKey) {
  const ai = makeAI(apiKey);
  if (typeof ai.validate === 'function') return ai.validate();
  try {
    const pager = await ai.models.list({ config: { pageSize: 50 } });
    const names = [];
    for (const m of pager.page || []) names.push(String(m.name || '').replace(/^models\//, ''));
    return { ok: true, models: names };
  } catch (e) {
    return { ok: false, kind: classifyError(e), detail: errText(e).slice(0, 300) };
  }
}
