import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { userTheme, setUserTheme, effectiveTheme, systemTheme, resetToSystem } = useTheme();

  const handleThemeClick = (theme: "light" | "dark") => {
    // Se o usuário clicar no tema que já está ativo (baseado no sistema) e não há preferência salva,
    // ou se clicar no mesmo tema que já está forçado, volta ao automático
    if ((!userTheme && theme === systemTheme) || (userTheme === theme)) {
      resetToSystem();
    } else {
      setUserTheme(theme);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="transition-all">
          <Sun className={`h-5 w-5 transition-all ${
            effectiveTheme === "light" 
              ? "rotate-0 scale-100" 
              : "-rotate-90 scale-0"
          }`} />
          <Moon className={`absolute h-5 w-5 transition-all ${
            effectiveTheme === "dark" 
              ? "rotate-0 scale-100" 
              : "rotate-90 scale-0"
          }`} />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeClick("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeClick("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Escuro</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
