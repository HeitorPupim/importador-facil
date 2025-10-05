import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoTooltip } from "./InfoTooltip";

interface CalculatorInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
  min?: number;
}

export function CalculatorInput({
  id,
  label,
  value,
  onChange,
  tooltip,
  prefix,
  suffix,
  type = "text",
  disabled = false,
  error,
  min,
}: CalculatorInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center text-sm font-medium">
        {label}
        {tooltip && <InfoTooltip content={tooltip} />}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${prefix ? "pl-12" : ""} ${suffix ? "pr-12" : ""} ${
            error ? "border-destructive" : ""
          }`}
          disabled={disabled}
          min={min}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
