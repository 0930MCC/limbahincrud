import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function CitySearchSelect({ cities, value, onChange, placeholder = "Cari kota..." }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#2ba5ad]/30 focus:border-[#2ba5ad] transition-all"
        >
          <span className={value ? "text-[#1a1a2e]" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <ChevronsUpDown size={16} className="text-gray-400 shrink-0 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Ketik nama kota..." className="text-sm" />
          <CommandList>
            <CommandEmpty>Kota tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {cities.map((c) => (
                <CommandItem
                  key={c.name}
                  value={c.name}
                  onSelect={(selected) => {
                    const match = cities.find((city) => city.name.toLowerCase() === selected.toLowerCase());
                    onChange(match ? match.name : selected);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === c.name ? "opacity-100" : "opacity-0")} />
                  {c.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
