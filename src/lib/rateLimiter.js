// Simple in-memory rate limiter — intentionally NOT persisted anywhere (no localStorage,
// sessionStorage, or database) per product requirement. This means the counter resets if the
// page is hard-refreshed; it only guards against repeated submits within the same browser tab
// session, which is the intended scope ("stop someone mashing the submit button").
//
// Usage:
//   const check = createRateLimiter({ max: 3, windowMs: 30 * 60 * 1000 });
//   check.canSend()      -> boolean
//   check.recordSend()   -> call after a successful send
//   check.msUntilNext()  -> ms until the oldest timestamp falls out of the window (0 if canSend())
export function createRateLimiter({ max, windowMs }) {
  let timestamps = [];

  const prune = () => {
    const cutoff = Date.now() - windowMs;
    timestamps = timestamps.filter((t) => t > cutoff);
  };

  return {
    canSend() {
      prune();
      return timestamps.length < max;
    },
    recordSend() {
      prune();
      timestamps.push(Date.now());
    },
    msUntilNext() {
      prune();
      if (timestamps.length < max) return 0;
      const oldest = Math.min(...timestamps);
      return Math.max(0, oldest + windowMs - Date.now());
    },
  };
}

export function formatWaitTime(ms) {
  const totalMinutes = Math.ceil(ms / 60000);
  if (totalMinutes <= 1) return 'sekitar 1 menit';
  return `sekitar ${totalMinutes} menit`;
}

// Shared instances for the two email buttons under the document cards on CustForm.jsx (Kirim
// Penawaran / Kirim Draf Kontrak) — module-scope, so they survive navigation within the same SPA
// session but not a full page reload.
export const quotationEmailLimiter = createRateLimiter({ max: 3, windowMs: 30 * 60 * 1000 });
export const registrationEmailLimiter = createRateLimiter({ max: 3, windowMs: 30 * 60 * 1000 });
