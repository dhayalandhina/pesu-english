// Small helpers shared by the Mac/PC server and the phone (browser) app.
export const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
export const words = (s) => (clean(s).match(/\S+/g) || []).length;

export function dkey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  return dkey(new Date(y, m - 1, d + n));
}

export function errText(e) {
  if (!e) return '';
  return [e.message, e.reason, e.status, e.code, e?.error?.message].filter(Boolean).join(' ');
}

export function classifyError(e) {
  const t = errText(e);
  if (/insufficient_quota|credit_balance_exhausted|no credits remaining|billing_hard_limit/i.test(t)) return 'billing'; // OpenAI: no credit left
  if (/location is not supported|not available in your country|FAILED_PRECONDITION.*location|unsupported_country_region_territory/i.test(t)) return 'region';
  if (/API[_ ]?key not valid|API_KEY_INVALID|invalid api key|invalid_api_key|Incorrect API key|PERMISSION_DENIED|unregistered callers|\b401\b|\b403\b/i.test(t)) return 'badkey';
  if (/quota|RESOURCE_EXHAUSTED|rate limit|rate_limit|too many requests|\b429\b/i.test(t)) return 'quota';
  if (/not found|is not supported|NOT_FOUND|\b404\b|no longer available|unsupported model|does not exist|model_not_found/i.test(t)) return 'model';
  if (/ENOTFOUND|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EAI_AGAIN|fetch failed|Failed to fetch|NetworkError|network|socket hang up|timeout/i.test(t)) return 'offline';
  return 'unknown';
}

export function parseJSONLoose(text) {
  const s = String(text || '').trim();
  try { return JSON.parse(s); } catch { /* fall through */ }
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) { try { return JSON.parse(fence[1]); } catch { /* fall through */ } }
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch { /* fall through */ } }
  throw new Error('invalid_json');
}

// Same retry/fallback rules for every text-model call (server SDK or browser REST).
// `call(model, jsonMode)` returns the reply text.
export async function genJSONWith(call, models, prompt) {
  let lastErr;
  for (const model of models) {
    for (const jsonMode of [true, false]) {
      try {
        const text = await call(model, jsonMode, prompt);
        return { model, data: parseJSONLoose(text) };
      } catch (e) {
        lastErr = e;
        if (classifyError(e) === 'model') break; // next model
        if (jsonMode && (/mime|json|INVALID_ARGUMENT|\b400\b/i.test(errText(e)) || e?.message === 'invalid_json')) continue;
        throw e;
      }
    }
  }
  throw lastErr || new Error('no_model');
}
