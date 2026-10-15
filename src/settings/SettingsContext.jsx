import { getAppSearchParams } from '@/lib/urlParams';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { WASTE_TYPES, SERVICE_CARDS, COMPARISON } from '@/data/pricelistData';
import { fetchActiveConfig, fetchConfigByName, fetchActiveNotes } from '@/lib/remoteConfig';

const SettingsContext = createContext(null);

// The app takes ALL pricing data (constants, vehicle rates, locations) AND all note text (Catatan
// Umum / Catatan Limbah / Catatan Pelayanan) from Supabase — the active rows in `pricelist_configs`
// and `pricelist_notes`. There is no local fallback: if Supabase isn't configured, unreachable, or
// either table has no active row, `error` is set and pages should show that instead of computing
// with missing/undefined numbers or blank notes. Waste type headers/availability, service card
// copy and the comparison table stay local (not part of this migration) — see pricelistData.js.
//
// If the URL has `?config=<name>` (CustForm.jsx), that NAMED config is used instead of whichever
// one is currently flagged `active` — e.g. a branch-specific or promo pricelist a link points at
// on purpose. Read directly off `window.location.search` (not react-router's useSearchParams)
// since this provider sits above <Routes> in App.jsx.
export function SettingsProvider({ children }) {
  const [remote, setRemote] = useState(null); // active row from pricelist_configs
  const [remoteNotes, setRemoteNotes] = useState(null); // active row from pricelist_notes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { status, message? } | null

  const configName = getAppSearchParams().get('config') || '';

  useEffect(() => {
    let cancelled = false;
    const configPromise = configName ? fetchConfigByName(configName) : fetchActiveConfig();
    Promise.all([configPromise, fetchActiveNotes()])
      .then(([configResult, notesResult]) => {
        if (cancelled) return;
        if (configResult.status === 'ok' && notesResult.status === 'ok') {
          setRemote(configResult.data);
          setRemoteNotes(notesResult.data);
        } else {
          setError(configResult.status !== 'ok' ? configResult : notesResult);
        }
      })
      .catch((err) => {
        if (!cancelled) setError({ status: 'error', message: err?.message || String(err) });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configName]);

  const constants = remote?.constants || null;

  const content = useMemo(
    () => ({
      wasteTypes: WASTE_TYPES,
      services: SERVICE_CARDS,
      comparison: COMPARISON,
      notes: {
        global: remoteNotes?.global_note || '',
        waste: remoteNotes?.waste_notes || {},
        service: remoteNotes?.service_notes || {},
      },
      locations: remote?.locations || [],
      vehicleRates: remote?.vehicle_rates || {},
    }),
    [remote, remoteNotes]
  );

  const ready = !loading && !error && !!constants && !!remoteNotes;

  const value = useMemo(
    () => ({ constants, content, loading, error, ready, configName: remote?.name || '' }),
    [constants, content, loading, error, ready, remote]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
