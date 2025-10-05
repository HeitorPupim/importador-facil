import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "./InfoTooltip";
import { RefreshCw, DollarSign, Clock } from "lucide-react";

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
  const [loadingFx, setLoadingFx] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>("\u2014");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const isFxField = id === "cambio"; // ativa modo câmbio sem alterar telas existentes

  const fetchFX = async () => {
    setLoadingFx(true);
    setApiStatus("Buscando câmbio\u2026");
    try {
      const r = await fetch("https://open.er-api.com/v6/latest/USD");
      const j = await r.json();
      let rate: number | null = null;

      if (j?.result === "success" && j?.rates?.BRL) {
        rate = j.rates.BRL;
        setApiStatus("Câmbio de open.er-api.com");
      } else {
        const r2 = await fetch(
          "https://api.exchangerate.host/latest?base=USD&symbols=BRL"
        );
        const j2 = await r2.json();
        if (j2?.rates?.BRL) {
          rate = j2.rates.BRL;
          setApiStatus("Câmbio de exchangerate.host");
        }
      }

      if (rate && isFinite(rate) && rate > 0) {
        const formatted = String(Number(rate).toFixed(2));
        onChange(formatted);
        setLastUpdated(new Date().toISOString());
      } else {
        setApiStatus("Falha ao obter câmbio. Edite manualmente.");
      }
    } catch {
      setApiStatus("Erro na API de câmbio. Edite manualmente.");
    } finally {
      setLoadingFx(false);
    }
  };

  useEffect(() => {
    if (isFxField && !value) {
      // valor inicial padrão do câmbio
      onChange("5.00");
      setApiStatus("Valor padrão inicial");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFxField]);

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

      {isFxField && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <DollarSign className="w-3 h-3 opacity-70" />
            <span>{apiStatus}</span>
            {lastUpdated && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(lastUpdated).toLocaleString("pt-BR")}
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={fetchFX}
            disabled={loadingFx}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            {loadingFx ? "Atualizando..." : "Atualizar câmbio"}
          </Button>
        </div>
      )}
    </div>
  );
}
