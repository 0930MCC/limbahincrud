import React, { useState } from 'react';
import { MapPin, Search, Check } from 'lucide-react';
import { WASTE_TYPES } from '@/data/pricelistData';
import { FieldLabel, StepIntro } from './fields';

// Step 1 of Pilih Pelayanan — lokasi only (jenis limbah moved to its own step, WasteStep below,
// per product requirement: lokasi and limbah are now two separate steps instead of one combined
// screen).
export function LocationStep({ location, onLocation, content, invalid }) {
  const [query, setQuery] = useState('');
  const locations = content?.locations || [];
  const filtered = query.trim()
    ? locations.filter((l) => l.name.toLowerCase().includes(query.trim().toLowerCase()))
    : locations;

  return (
    <div className="space-y-5">
      <StepIntro
        title="Lokasi"
        subtitle="Cari lokasi pengambilan limbah Anda. Klik lokasi yang sudah terpilih untuk membatalkannya."
      />

      <div>
        <FieldLabel icon={Search}>Cari Lokasi</FieldLabel>
        <input
          className="pl-input"
          placeholder="Ketik nama kota / kabupaten…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {/* Capped so this list takes far less vertical space than the whole viewport; the rest
            scroll. Searching narrows it rather than expanding the box. Taller than the old
            combined step's list since jenis limbah no longer shares this screen. */}
        <div
          className={`mt-2 max-h-[16rem] overflow-y-auto rounded-lg border bg-card p-2 ${
            invalid ? 'border-destructive ring-2 ring-destructive/30' : 'border-border'
          }`}
        >
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">Lokasi tidak ditemukan.</p>
          ) : (
            <div className="space-y-1">
              {filtered.map((l) => {
                const active = location === l.name;
                return (
                  <button
                    key={l.name}
                    type="button"
                    onClick={() => onLocation(active ? '' : l.name)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                      active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1">{l.name}</span>
                    {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {invalid && (
          <p className="mt-1.5 text-[11px] font-medium text-destructive">Pilih lokasi terlebih dahulu.</p>
        )}
      </div>
    </div>
  );
}

// Step 2 of Pilih Pelayanan — jenis limbah only, now that lokasi lives on its own step above.
export function WasteStep({ waste, onWaste, content, invalid }) {
  const wasteTypes = content?.wasteTypes || WASTE_TYPES;

  return (
    <div className="space-y-5">
      <StepIntro
        title="Jenis Limbah"
        subtitle="Satu jenis limbah per dokumen price list — pilih jenis limbah utama Anda."
      />
      <div>
        <div className={`grid gap-2.5 sm:grid-cols-2 ${invalid ? 'rounded-xl ring-2 ring-destructive/30' : ''}`}>
          {wasteTypes.map((w) => {
            const active = waste === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => onWaste(active ? '' : w.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? 'border-primary bg-primary/5'
                    : invalid
                      ? 'border-destructive/60 bg-card hover:border-destructive'
                      : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold tracking-wide text-primary">{w.id}</span>
                  {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </div>
                <p className="mt-1 text-xs font-semibold">{w.header}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{w.definisi}</p>
              </button>
            );
          })}
        </div>
        {invalid && (
          <p className="mt-1.5 text-[11px] font-medium text-destructive">Pilih jenis limbah terlebih dahulu.</p>
        )}
      </div>
    </div>
  );
}
