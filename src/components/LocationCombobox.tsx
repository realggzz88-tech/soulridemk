import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface LocationComboboxProps {
  locations: Location[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  iconColor?: string;
}

const LocationCombobox = ({
  locations,
  value,
  onChange,
  placeholder = "Select location...",
  label,
  iconColor = "text-earth-green-glow",
}: LocationComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset input to last valid value if user typed something invalid
        if (inputValue !== value) {
          const matchedLocation = locations.find(
            (loc) => loc.name.toLowerCase() === inputValue.toLowerCase()
          );
          if (matchedLocation) {
            onChange(matchedLocation.name);
          } else if (inputValue.trim()) {
            // Keep the free text input
            onChange(inputValue);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue, value, locations, onChange]);

  // Filter locations based on input
  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
  };

  const handleSelectLocation = (location: Location) => {
    setInputValue(location.name);
    onChange(location.name);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter" && filteredLocations.length > 0) {
      e.preventDefault();
      handleSelectLocation(filteredLocations[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-foreground/80 mb-2 tracking-wide">
        <MapPin size={14} className={cn("inline mr-2", iconColor)} />
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-soul-amber/50 focus:ring-2 focus:ring-soul-amber/20 transition-all pr-10"
        />
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown
            size={18}
            className={cn("transition-transform", isOpen && "rotate-180")}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
            {filteredLocations.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No locations found. Type freely for custom location.
              </div>
            ) : (
              filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur before click
                    handleSelectLocation(loc);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-muted/70 transition-colors flex items-center justify-between",
                    "first:rounded-t-xl last:rounded-b-xl",
                    loc.name.toLowerCase() === inputValue.toLowerCase() &&
                      "bg-muted/50"
                  )}
                >
                  <span className="text-foreground">{loc.name}</span>
                  {loc.name.toLowerCase() === inputValue.toLowerCase() && (
                    <Check size={16} className="text-soul-amber" />
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCombobox;
