import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./components/ui/button";
function Navabr() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="p-8">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">Expense Tracker</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
      <br />
      <hr />
    </header>
  );
}

export default Navabr;
