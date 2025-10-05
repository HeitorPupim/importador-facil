import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CalculatorInput } from "@/components/CalculatorInput";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  calculateImportCosts,
  formatCurrency,
  formatPercent,
  parseNumber,
  CalculationInputs,
} from "@/utils/calculations";
import {
  DollarSign,
  Truck,
  Package,
  RefreshCw,
  Calculator,
  TrendingUp,
  FileText,
  Wallet,
  Target,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

interface FormState {
  cambio: string;
  mercadoriaUsd: string;
  freteUsd: string;
  quantidade: string;
  icmsPercent: string;
  taxaAdmPercent: string;
}

const Index = () => {
  const [formState, setFormState] = useLocalStorage<FormState>("import_calc_data", {
    cambio: "",
    mercadoriaUsd: "",
    freteUsd: "",
    quantidade: "",
    icmsPercent: "18",
    taxaAdmPercent: "3",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // Limpa erro do campo ao editar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const cambio = parseNumber(formState.cambio);
    const mercadoria = parseNumber(formState.mercadoriaUsd);
    const frete = parseNumber(formState.freteUsd);
    const qtd = formState.quantidade ? parseNumber(formState.quantidade) : 0;
    const icms = parseNumber(formState.icmsPercent);
    const taxaAdm = parseNumber(formState.taxaAdmPercent);

    if (cambio <= 0) newErrors.cambio = "Câmbio deve ser maior que 0";
    if (mercadoria < 0) newErrors.mercadoriaUsd = "Valor não pode ser negativo";
    if (frete < 0) newErrors.freteUsd = "Valor não pode ser negativo";
    if (qtd < 0) newErrors.quantidade = "Quantidade não pode ser negativa";
    if (icms < 0 || icms > 100) newErrors.icmsPercent = "ICMS deve estar entre 0 e 100";
    if (taxaAdm < 0 || taxaAdm > 100)
      newErrors.taxaAdmPercent = "Taxa deve estar entre 0 e 100";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchExchangeRate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=BRL"
      );
      const data = await response.json();

      if (data.rates && data.rates.BRL) {
        const rate = data.rates.BRL.toFixed(2);
        updateField("cambio", rate);
        toast.success(`Câmbio atualizado: ${rate}`);
      } else {
        toast.error("Falha ao obter taxa de câmbio");
      }
    } catch (error) {
      toast.error("Erro ao conectar com API de câmbio");
      console.error("Exchange rate fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formState.cambio &&
    formState.mercadoriaUsd &&
    formState.freteUsd &&
    formState.icmsPercent &&
    formState.taxaAdmPercent &&
    Object.keys(errors).length === 0 &&
    parseNumber(formState.cambio) > 0;

  const calculationInputs: CalculationInputs = {
    cambio: parseNumber(formState.cambio),
    mercadoriaUsd: parseNumber(formState.mercadoriaUsd),
    freteUsd: parseNumber(formState.freteUsd),
    quantidade: formState.quantidade ? parseNumber(formState.quantidade) : 1,
    icmsPercent: parseNumber(formState.icmsPercent),
    taxaAdmPercent: parseNumber(formState.taxaAdmPercent),
  };

  const results = isFormValid ? calculateImportCosts(calculationInputs) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calculator className="h-8 w-8 text-primary" />
              Calculadora de Importação
            </h1>
            <p className="text-muted-foreground mt-1">
              Calcule custos de importação para o Brasil
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Inputs */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Dados da Importação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <CalculatorInput
                      id="cambio"
                      label="Câmbio USD → BRL"
                      value={formState.cambio}
                      onChange={(v) => updateField("cambio", v)}
                      tooltip="Taxa de conversão de dólar para real"
                      prefix="US$"
                      type="number"
                      error={errors.cambio}
                      min={0}
                    />
                  </div>
                  <Button
                    onClick={fetchExchangeRate}
                    disabled={loading}
                    className="mt-8"
                    size="icon"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                </div>

                <CalculatorInput
                  id="mercadoria"
                  label="Valor da Mercadoria"
                  value={formState.mercadoriaUsd}
                  onChange={(v) => updateField("mercadoriaUsd", v)}
                  tooltip="Valor FOB da mercadoria em dólares"
                  prefix="US$"
                  type="number"
                  error={errors.mercadoriaUsd}
                  min={0}
                />

                <CalculatorInput
                  id="frete"
                  label="Valor do Frete"
                  value={formState.freteUsd}
                  onChange={(v) => updateField("freteUsd", v)}
                  tooltip="Custo do frete internacional em dólares"
                  prefix="US$"
                  type="number"
                  error={errors.freteUsd}
                  min={0}
                />

                <CalculatorInput
                  id="quantidade"
                  label="Quantidade (opcional)"
                  value={formState.quantidade}
                  onChange={(v) => updateField("quantidade", v)}
                  tooltip="Número de unidades para calcular custo unitário"
                  type="number"
                  error={errors.quantidade}
                  min={1}
                />

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Alíquotas de Impostos
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <CalculatorInput
                      id="ii"
                      label="II (%)"
                      value="60"
                      onChange={() => {}}
                      tooltip="Imposto de Importação (fixo em 60%)"
                      suffix="%"
                      type="number"
                      disabled
                    />
                    <CalculatorInput
                      id="icms"
                      label="ICMS (%)"
                      value={formState.icmsPercent}
                      onChange={(v) => updateField("icmsPercent", v)}
                      tooltip="ICMS com gross-up (padrão 18%)"
                      suffix="%"
                      type="number"
                      error={errors.icmsPercent}
                      min={0}
                    />
                    <CalculatorInput
                      id="taxaAdm"
                      label="Taxa Adm (%)"
                      value={formState.taxaAdmPercent}
                      onChange={(v) => updateField("taxaAdmPercent", v)}
                      tooltip="Taxa administrativa (padrão 3%)"
                      suffix="%"
                      type="number"
                      error={errors.taxaAdmPercent}
                      min={0}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regras de Cálculo */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Regras de Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <p>
                  <strong>Subtotal:</strong> (Mercadoria + Frete) × Câmbio
                </p>
                <p>
                  <strong>II:</strong> Subtotal × 60%
                </p>
                <p>
                  <strong>Base ICMS:</strong> (Subtotal + II) ÷ (1 − ICMS%)
                </p>
                <p>
                  <strong>ICMS:</strong> Base ICMS × ICMS%
                </p>
                <p>
                  <strong>Taxa Adm:</strong> (Subtotal + II + ICMS) × Taxa%
                </p>
                <p>
                  <strong>Total:</strong> Subtotal + II + ICMS + Taxa Adm
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Resultados */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Detalhamento de Custos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isFormValid ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Preencha os campos para ver os cálculos</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ResultCard
                      icon={Package}
                      label="Subtotal (BRL)"
                      value={formatCurrency(results!.subtotalBrl, "BRL")}
                      tooltip="Valor total da mercadoria + frete convertido para BRL"
                    />

                    <ResultCard
                      icon={TrendingUp}
                      label="Imposto de Importação (60%)"
                      value={formatCurrency(results!.ii, "BRL")}
                      tooltip="Imposto de Importação fixo de 60% sobre o subtotal"
                    />

                    <ResultCard
                      icon={FileText}
                      label="Base do ICMS"
                      value={formatCurrency(results!.baseIcms, "BRL")}
                      tooltip="Base de cálculo do ICMS com gross-up"
                    />

                    <ResultCard
                      icon={TrendingUp}
                      label={`ICMS (${formatPercent(calculationInputs.icmsPercent)})`}
                      value={formatCurrency(results!.icms, "BRL")}
                      tooltip="ICMS calculado sobre a base com gross-up"
                    />

                    <ResultCard
                      icon={Truck}
                      label={`Taxa Administrativa (${formatPercent(
                        calculationInputs.taxaAdmPercent
                      )})`}
                      value={formatCurrency(results!.taxaAdm, "BRL")}
                      tooltip="Taxa administrativa aplicada sobre os custos"
                    />

                    <div className="pt-3 border-t">
                      <ResultCard
                        icon={DollarSign}
                        label="Total (BRL)"
                        value={formatCurrency(results!.totalBrl, "BRL")}
                        tooltip="Custo total da importação incluindo todos os impostos e taxas"
                        highlight
                      />
                    </div>

                    {calculationInputs.quantidade >= 1 && (
                      <ResultCard
                        icon={ShoppingCart}
                        label="Custo Unitário (BRL)"
                        value={formatCurrency(results!.unitarioBrl, "BRL")}
                        tooltip={`Custo por unidade (total ÷ ${calculationInputs.quantidade})`}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Calculadora de Importação Simplificada • Valores aproximados para fins de
            estimativa
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
