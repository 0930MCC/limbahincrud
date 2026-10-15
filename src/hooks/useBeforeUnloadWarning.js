import { useEffect } from 'react';

// Warns the browser's native "leave site?" prompt while `active` is true. Used while a
// quotation/registration email is actually in flight (`sending`) so a refresh or tab-close mid
// request doesn't silently lose it — see PelayananLayer/PerusahaanLayer's `sending` state.
//
// NOTE: this only covers refresh/close. It can't stop someone hitting the browser Back button,
// and the message text itself is ignored by every modern browser (they all show their own fixed
// wording) — the important part is just that `preventDefault()`/`returnValue` is set at all,
// which is what makes the browser show a confirmation dialog in the first place.
export default function useBeforeUnloadWarning(active) {
  useEffect(() => {
    if (!active) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [active]);
}
