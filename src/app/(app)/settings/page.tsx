"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Type } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import FamilyHistoryCard from "@/components/settings/family-history-card";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="animate-fadeIn space-y-8 pb-20">
      <header className="mt-8">
        <h1 className="font-serif text-2xl text-foreground">Settings</h1>
      </header>

      <FamilyHistoryCard />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how EverNest looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-foreground">
              {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              <Label htmlFor="darkMode">Dark Mode</Label>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "h-6 w-12 rounded-full p-1 transition-colors duration-300",
                theme === "dark" ? "bg-sage-600" : "bg-muted",
              )}
            >
              <div
                className={cn(
                  "h-4 w-4 transform rounded-full bg-white transition-transform duration-300",
                  theme === "dark" ? "translate-x-6" : "",
                )}
              />
            </button>
          </div>

          {/* Font Size Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-foreground">
              <Type size={20} />
              <Label>Text Size</Label>
            </div>
            <span className="text-sm text-muted-foreground">
              Use browser zoom for larger text
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            EverNest is a prenatal storytelling companion that helps expectant
            parents bond with their unborn baby through personalized, calming
            bedtime stories.
          </p>
          <p className="text-xs italic text-muted-foreground">
            Disclaimer: This app provides creative storytelling for bonding
            purposes only. It does not provide medical advice.
          </p>
          <p className="text-xs text-muted-foreground/60">v1.0.0</p>
        </CardContent>
      </Card>
    </div>
  );
}
