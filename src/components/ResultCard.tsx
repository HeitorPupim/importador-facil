import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "./InfoTooltip";
import { LucideIcon } from "lucide-react";

interface ResultCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tooltip?: string;
  highlight?: boolean;
  compact?: boolean;
}

export function ResultCard({
  icon: Icon,
  label,
  value,
  tooltip,
  highlight = false,
  compact = false,
}: ResultCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-md ${
        highlight ? "border-primary bg-primary/5" : ""
      } ${compact ? "border-transparent shadow-none" : ""}`}
    >
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className={`font-medium text-muted-foreground flex items-center ${
              compact ? "text-xs" : "text-sm"
            }`}>
              <Icon className={`mr-2 ${compact ? "h-3 w-3" : "h-4 w-4"}`} />
              {label}
              {tooltip && <InfoTooltip content={tooltip} />}
            </p>
            <p
              className={`font-bold ${
                compact ? "text-base" : "text-2xl"
              } ${highlight ? "text-primary" : ""}`}
            >
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
