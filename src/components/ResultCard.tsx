import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "./InfoTooltip";
import { LucideIcon } from "lucide-react";

interface ResultCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tooltip?: string;
  highlight?: boolean;
}

export function ResultCard({
  icon: Icon,
  label,
  value,
  tooltip,
  highlight = false,
}: ResultCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-md ${
        highlight ? "border-primary bg-primary/5" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center">
              <Icon className="h-4 w-4 mr-2" />
              {label}
              {tooltip && <InfoTooltip content={tooltip} />}
            </p>
            <p
              className={`text-2xl font-bold ${
                highlight ? "text-primary" : ""
              }`}
            >
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
