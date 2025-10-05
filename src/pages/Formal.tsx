import { useState, useEffect } from "react";
import { CalculatorInput } from "@/components/CalculatorInput";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  Calculator,
  TrendingUp,
  FileText,
  Wallet,
  Target,
  ShoppingCart,
  ChevronDown,
  Receipt,
  Building2,
  Globe,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

interface FormalFormState {
  cambio: string;
  mercadoriaUsd: string;
  freteUsd: string;
  seguroUsd: string;
  quantidade: string;
  pesoBruto: string;
  pesoLiquido: string;
  ncm: string;
  origem: string;
  destino: string;
  iiPercent: string;
  ipiPercent: string;
  pisPercent: string;
  cofinsPercent: string;
  icmsPercent: string;
  taxaAdmPercent: string;
  taxaSiscomex: string;
  taxaArmazenagem: string;
  taxaDespacho: string;
}

const Formal = () => {
  const [formState, setFormState] = useState<FormalFormState>({
    cambio: "",
    mercadoriaUsd: "",
    freteUsd: "",
    seguroUsd: "",
    quantidade: "",
    pesoBruto: "",
    pesoLiquido: "",
    ncm: "",
    origem: "",
    destino: "",
    iiPercent: "60",
    ipiPercent: "0",
    pisPercent: "1.65",
    cofinsPercent: "7.6",
    icmsPercent: "18",
    taxaAdmPercent: "3",
    taxaSiscomex: "0",
    taxaArmazenagem: "0",
    taxaDespacho: "0",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRulesOpen, setIsRulesOpen] = useState(true);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateField = (field: keyof FormalFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const cambio = parseNumber(formState.cambio);
    const mercadoria = parseNumber(formState.mercadoriaUsd);
    const frete = parseNumber(formState.freteUsd);
    const seguro = parseNumber(formState.seguroUsd);
    const qtd = formState.quantidade ? parseNumber(formState.quantidade) : 0;
    const pesoBruto = parseNumber(formState.pesoBruto);
    const pesoLiquido = parseNumber(formState.pesoLiquido);

    if (cambio <= 0) newErrors.cambio = "Câmbio deve ser maior que 0";
    if (mercadoria < 0) newErrors.mercadoriaUsd = "Valor não pode ser negativo";
    if (frete < 0) newErrors.freteUsd = "Valor não pode ser negativo";
    if (seguro < 0) newErrors.seguroUsd = "Valor não pode ser negativo";
    if (qtd < 0) newErrors.quantidade = "Quantidade não pode ser negativa";
    if (pesoBruto < 0) newErrors.pesoBruto = "Peso não pode ser negativo";
    if (pesoLiquido < 0) newErrors.pesoLiquido = "Peso não pode ser negativo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    formState.cambio &&
    formState.mercadoriaUsd &&
    formState.iiPercent &&
    formState.icmsPercent &&
    formState.taxaAdmPercent &&
    Object.keys(errors).length === 0 &&
    parseNumber(formState.cambio) > 0;

  const qtyStr = formState.quantidade;
  const qtyParsed = qtyStr ? parseNumber(qtyStr) : 0;
  const normalizedQty = qtyStr === "" ? 0 : qtyParsed === 0 ? 1 : qtyParsed;

  // Para a versão formal, vamos usar os mesmos cálculos mas com mais campos
  const calculationInputs: CalculationInputs = {
    cambio: parseNumber(formState.cambio),
    mercadoriaUsd: parseNumber(formState.mercadoriaUsd),
    freteUsd: parseNumber(formState.freteUsd) + parseNumber(formState.seguroUsd), // Inclui seguro no frete
    quantidade: normalizedQty,
    icmsPercent: parseNumber(formState.icmsPercent),
    taxaAdmPercent: parseNumber(formState.taxaAdmPercent),
  };

  const results = isFormValid ? calculateImportCosts(calculationInputs) : null;

  // Cálculos adicionais para a versão formal
  const additionalCosts = {
    seguroBrl: parseNumber(formState.seguroUsd) * parseNumber(formState.cambio),
    taxaSiscomexBrl: parseNumber(formState.taxaSiscomex),
    taxaArmazenagemBrl: parseNumber(formState.taxaArmazenagem),
    taxaDespachoBrl: parseNumber(formState.taxaDespacho),
    ipiBrl: results ? (results.subtotalBrl + results.ii) * (parseNumber(formState.ipiPercent) / 100) : 0,
    pisBrl: results ? results.subtotalBrl * (parseNumber(formState.pisPercent) / 100) : 0,
    cofinsBrl: results ? results.subtotalBrl * (parseNumber(formState.cofinsPercent) / 100) : 0,
  };

  const totalAdditionalCosts = Object.values(additionalCosts).reduce((sum, cost) => sum + cost, 0);
  const totalFormal = results ? results.totalBrl + totalAdditionalCosts : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Inputs */}
          <div className="space-y-6">
            {/* Dados Básicos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Dados Básicos da Importação
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
                </div>

                <CalculatorInput
                  id="mercadoria"
                  label="Valor da Mercadoria (FOB)"
                  value={formState.mercadoriaUsd}
                  onChange={(v) => updateField("mercadoriaUsd", v)}
                  tooltip="Valor FOB da mercadoria em dólares"
                  prefix="US$"
                  type="number"
                  error={errors.mercadoriaUsd}
                  min={0}
                />

                <div className="grid grid-cols-2 gap-3">
                  <CalculatorInput
                    id="frete"
                    label="Frete Internacional"
                    value={formState.freteUsd}
                    onChange={(v) => updateField("freteUsd", v)}
                    tooltip="Custo do frete internacional"
                    prefix="US$"
                    type="number"
                    error={errors.freteUsd}
                    min={0}
                  />
                  <CalculatorInput
                    id="seguro"
                    label="Seguro Internacional"
                    value={formState.seguroUsd}
                    onChange={(v) => updateField("seguroUsd", v)}
                    tooltip="Custo do seguro internacional"
                    prefix="US$"
                    type="number"
                    error={errors.seguroUsd}
                    min={0}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <CalculatorInput
                    id="quantidade"
                    label="Quantidade"
                    value={formState.quantidade}
                    onChange={(v) => updateField("quantidade", v)}
                    tooltip="Número de unidades"
                    type="number"
                    error={errors.quantidade}
                    min={1}
                  />
                  <CalculatorInput
                    id="pesoBruto"
                    label="Peso Bruto (kg)"
                    value={formState.pesoBruto}
                    onChange={(v) => updateField("pesoBruto", v)}
                    tooltip="Peso bruto total"
                    type="number"
                    error={errors.pesoBruto}
                    min={0}
                  />
                  <CalculatorInput
                    id="pesoLiquido"
                    label="Peso Líquido (kg)"
                    value={formState.pesoLiquido}
                    onChange={(v) => updateField("pesoLiquido", v)}
                    tooltip="Peso líquido total"
                    type="number"
                    error={errors.pesoLiquido}
                    min={0}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <CalculatorInput
                    id="ncm"
                    label="NCM"
                    value={formState.ncm}
                    onChange={(v) => updateField("ncm", v)}
                    tooltip="Nomenclatura Comum do Mercosul"
                    placeholder="Ex: 1234.56.78"
                  />
                  <CalculatorInput
                    id="origem"
                    label="País de Origem"
                    value={formState.origem}
                    onChange={(v) => updateField("origem", v)}
                    tooltip="País de origem da mercadoria"
                    placeholder="Ex: China"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Impostos e Taxas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Impostos e Taxas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <CalculatorInput
                    id="ii"
                    label="II (%)"
                    value={formState.iiPercent}
                    onChange={(v) => updateField("iiPercent", v)}
                    tooltip="Imposto de Importação"
                    suffix="%"
                    type="number"
                    min={0}
                  />
                  <CalculatorInput
                    id="ipi"
                    label="IPI (%)"
                    value={formState.ipiPercent}
                    onChange={(v) => updateField("ipiPercent", v)}
                    tooltip="Imposto sobre Produtos Industrializados"
                    suffix="%"
                    type="number"
                    min={0}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <CalculatorInput
                    id="pis"
                    label="PIS (%)"
                    value={formState.pisPercent}
                    onChange={(v) => updateField("pisPercent", v)}
                    tooltip="Programa de Integração Social"
                    suffix="%"
                    type="number"
                    min={0}
                  />
                  <CalculatorInput
                    id="cofins"
                    label="COFINS (%)"
                    value={formState.cofinsPercent}
                    onChange={(v) => updateField("cofinsPercent", v)}
                    tooltip="Contribuição para Financiamento da Seguridade Social"
                    suffix="%"
                    type="number"
                    min={0}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <CalculatorInput
                    id="icms"
                    label="ICMS (%)"
                    value={formState.icmsPercent}
                    onChange={(v) => updateField("icmsPercent", v)}
                    tooltip="ICMS com gross-up"
                    suffix="%"
                    type="number"
                    min={0}
                  />
                  <CalculatorInput
                    id="taxaAdm"
                    label="Taxa Adm (%)"
                    value={formState.taxaAdmPercent}
                    onChange={(v) => updateField("taxaAdmPercent", v)}
                    tooltip="Taxa administrativa"
                    suffix="%"
                    type="number"
                    min={0}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Taxas Adicionais */}
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <Card className="bg-muted/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/70 transition-colors">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Taxas Adicionais (Opcional)
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isAdvancedOpen ? "rotate-180" : ""
                        }`}
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <CalculatorInput
                      id="taxaSiscomex"
                      label="Taxa Siscomex (BRL)"
                      value={formState.taxaSiscomex}
                      onChange={(v) => updateField("taxaSiscomex", v)}
                      tooltip="Taxa do Sistema Integrado de Comércio Exterior"
                      prefix="R$"
                      type="number"
                      min={0}
                    />
                    <CalculatorInput
                      id="taxaArmazenagem"
                      label="Taxa de Armazenagem (BRL)"
                      value={formState.taxaArmazenagem}
                      onChange={(v) => updateField("taxaArmazenagem", v)}
                      tooltip="Taxa de armazenagem no porto/aeroporto"
                      prefix="R$"
                      type="number"
                      min={0}
                    />
                    <CalculatorInput
                      id="taxaDespacho"
                      label="Taxa de Despacho (BRL)"
                      value={formState.taxaDespacho}
                      onChange={(v) => updateField("taxaDespacho", v)}
                      tooltip="Taxa de despacho aduaneiro"
                      prefix="R$"
                      type="number"
                      min={0}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Regras de Cálculo */}
            <Collapsible open={isRulesOpen} onOpenChange={setIsRulesOpen}>
              <Card className="bg-muted/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/70 transition-colors">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Regras de Cálculo Formal
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isRulesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="text-xs space-y-2 text-muted-foreground pt-0">
                    <p>
                      <strong>Valor Aduaneiro:</strong> (Mercadoria + Frete + Seguro) × Câmbio
                    </p>
                    <p>
                      <strong>II:</strong> Valor Aduaneiro × II%
                    </p>
                    <p>
                      <strong>IPI:</strong> (Valor Aduaneiro + II) × IPI%
                    </p>
                    <p>
                      <strong>PIS:</strong> Valor Aduaneiro × PIS%
                    </p>
                    <p>
                      <strong>COFINS:</strong> Valor Aduaneiro × COFINS%
                    </p>
                    <p>
                      <strong>Base ICMS:</strong> (Valor Aduaneiro + II + IPI + PIS + COFINS) ÷ (1 − ICMS%)
                    </p>
                    <p>
                      <strong>ICMS:</strong> Base ICMS × ICMS%
                    </p>
                    <p>
                      <strong>Taxa Adm:</strong> (Valor Aduaneiro + Impostos) × Taxa%
                    </p>
                    <p>
                      <strong>Total:</strong> Valor Aduaneiro + Todos os Impostos + Taxas
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Coluna Direita - Resultados */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Detalhamento de Custos Formal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isFormValid ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Preencha os campos obrigatórios para ver os cálculos</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ResultCard
                      icon={Package}
                      label="Valor Aduaneiro (BRL)"
                      value={formatCurrency(results!.subtotalBrl, "BRL")}
                      tooltip="Valor total da mercadoria + frete + seguro convertido para BRL"
                    />

                    <div className="space-y-2 pl-4 border-l-2 border-muted">
                      <ResultCard
                        icon={TrendingUp}
                        label={`Imposto de Importação (${formatPercent(parseNumber(formState.iiPercent))})`}
                        value={formatCurrency(results!.ii, "BRL")}
                        tooltip="Imposto de Importação sobre o valor aduaneiro"
                        compact
                      />

                      <ResultCard
                        icon={TrendingUp}
                        label={`IPI (${formatPercent(parseNumber(formState.ipiPercent))})`}
                        value={formatCurrency(additionalCosts.ipiBrl, "BRL")}
                        tooltip="Imposto sobre Produtos Industrializados"
                        compact
                      />

                      <ResultCard
                        icon={TrendingUp}
                        label={`PIS (${formatPercent(parseNumber(formState.pisPercent))})`}
                        value={formatCurrency(additionalCosts.pisBrl, "BRL")}
                        tooltip="Programa de Integração Social"
                        compact
                      />

                      <ResultCard
                        icon={TrendingUp}
                        label={`COFINS (${formatPercent(parseNumber(formState.cofinsPercent))})`}
                        value={formatCurrency(additionalCosts.cofinsBrl, "BRL")}
                        tooltip="Contribuição para Financiamento da Seguridade Social"
                        compact
                      />

                      <ResultCard
                        icon={FileText}
                        label="Base do ICMS"
                        value={formatCurrency(results!.baseIcms, "BRL")}
                        tooltip="Base de cálculo do ICMS com gross-up"
                        compact
                      />

                      <ResultCard
                        icon={TrendingUp}
                        label={`ICMS (${formatPercent(calculationInputs.icmsPercent)})`}
                        value={formatCurrency(results!.icms, "BRL")}
                        tooltip="ICMS calculado sobre a base com gross-up"
                        compact
                      />

                      <ResultCard
                        icon={Truck}
                        label={`Taxa Administrativa (${formatPercent(
                          calculationInputs.taxaAdmPercent
                        )})`}
                        value={formatCurrency(results!.taxaAdm, "BRL")}
                        tooltip="Taxa administrativa aplicada sobre os custos"
                        compact
                      />
                    </div>

                    <ResultCard
                      icon={Receipt}
                      label="Total de Impostos"
                      value={formatCurrency(
                        results!.ii + results!.icms + results!.taxaAdm + 
                        additionalCosts.ipiBrl + additionalCosts.pisBrl + additionalCosts.cofinsBrl,
                        "BRL"
                      )}
                      tooltip="Soma de todos os impostos e taxas"
                    />

                    {totalAdditionalCosts > 0 && (
                      <ResultCard
                        icon={Building2}
                        label="Taxas Adicionais"
                        value={formatCurrency(totalAdditionalCosts, "BRL")}
                        tooltip="Siscomex + Armazenagem + Despacho"
                      />
                    )}

                    <div className="pt-3 border-t-2 border-primary/20">
                      <ResultCard
                        icon={DollarSign}
                        label="Total Final (BRL)"
                        value={formatCurrency(totalFormal, "BRL")}
                        tooltip="Custo total da importação incluindo todos os impostos e taxas"
                        highlight
                      />
                    </div>

                    {formState.quantidade !== "" && calculationInputs.quantidade >= 1 && (
                      <ResultCard
                        icon={ShoppingCart}
                        label="Custo Unitário (BRL)"
                        value={formatCurrency(totalFormal / calculationInputs.quantidade, "BRL")}
                        tooltip={`Custo por unidade (total ÷ ${calculationInputs.quantidade})`}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Aviso */}
            <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                      Cálculo Formal
                    </p>
                    <p className="text-amber-700 dark:text-amber-300">
                      Esta versão inclui todos os impostos e taxas aplicáveis. 
                      Consulte sempre um despachante aduaneiro para cálculos oficiais.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Versão Formal • Cálculo detalhado com todos os impostos e taxas
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Formal;
