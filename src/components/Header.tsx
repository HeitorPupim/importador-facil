import { Link, useLocation } from "react-router-dom";
import { Calculator, PlaneTakeoff, Ship } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Simplificada",
      icon: PlaneTakeoff,
      description: "Cálculo da Importação Simplificada"
    },
    {
      path: "/formal",
      label: "Formal",
      icon: Ship,
      description: "Cálculo da Importação Formal"
    }
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">ezImport Calculator</h1>
                <p className="text-sm text-muted-foreground">
                  Calculadora de Importação Simplificada e Formal
                </p>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 transition-all",
                    isActive && "shadow-sm"
                  )}
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Descrição da página atual */}
        <div className="mt-3 pt-3 border-t border-border/50">
          {navItems.map((item) => {
            if (location.pathname === item.path) {
              return (
                <p key={item.path} className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>
    </header>
  );
}
