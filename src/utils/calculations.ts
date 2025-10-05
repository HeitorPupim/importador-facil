export interface CalculationInputs {
  cambio: number;
  mercadoriaUsd: number;
  freteUsd: number;
  quantidade: number;
  icmsPercent: number;
  taxaAdmPercent: number;
}

export interface CalculationResults {
  subtotalBrl: number;
  ii: number;
  baseIcms: number;
  icms: number;
  taxaAdm: number;
  totalBrl: number;
  unitarioBrl: number;
}

// Arredondamento bancário (half-to-even)
function roundBankers(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(num * factor) / factor;
  return Number(rounded.toFixed(decimals));
}

export function calculateImportCosts(inputs: CalculationInputs): CalculationResults {
  const { cambio, mercadoriaUsd, freteUsd, quantidade, icmsPercent, taxaAdmPercent } = inputs;

  // 1. Subtotal (BRL)
  const subtotalBrl = roundBankers((mercadoriaUsd + freteUsd) * cambio);

  // 2. Imposto de Importação – II (60%)
  const ii = roundBankers(subtotalBrl * 0.6);

  // 3. Base de ICMS (gross-up)
  const aliqIcms = icmsPercent / 100;
  const baseIcms = roundBankers((subtotalBrl + ii) / (1 - aliqIcms));

  // 4. ICMS
  const icms = roundBankers(baseIcms * aliqIcms);

  // 5. Taxa Administrativa
  const aliqAdm = taxaAdmPercent / 100;
  const taxaAdm = roundBankers((subtotalBrl + ii + icms) * aliqAdm);

  // 6. Total (BRL)
  const totalBrl = roundBankers(subtotalBrl + ii + icms + taxaAdm);

  // 7. Custo unitário (BRL)
  const unitarioBrl = quantidade >= 1 ? roundBankers(totalBrl / quantidade) : 0;

  return {
    subtotalBrl,
    ii,
    baseIcms,
    icms,
    taxaAdm,
    totalBrl,
    unitarioBrl,
  };
}

export function formatCurrency(value: number, currency: "BRL" | "USD"): string {
  const locale = currency === "BRL" ? "pt-BR" : "en-US";
  const currencyCode = currency;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export function parseNumber(value: string): number {
  // Aceita vírgula ou ponto como separador decimal
  const normalized = value.replace(",", ".");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}
