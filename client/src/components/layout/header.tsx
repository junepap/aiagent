
import { Bell, User } from "lucide-react";
import { useNotifications } from "@/lib/notification";
import { useLocation } from "wouter";
import React, { useState, createContext, useContext } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const ThemeContext = createContext<{
  theme?: string;
  setTheme?: (theme: string) => void;
}>({});

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    if (setTheme) {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark');
    }
  };

  return (
    <Button onClick={toggleTheme} variant="ghost">
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
}

export function Header() {
  const { notifications } = useNotifications();
  const [, setLocation] = useLocation();
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <header className="fixed top-0 left-64 right-0 z-40 flex h-16 items-center gap-x-4 border-b bg-background px-6">
        <div className="flex flex-1 gap-x-4 self-stretch justify-end">
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {notifications?.map((notification) => (
                    <div key={notification.id} className="p-4 rounded-lg bg-muted">
                      {notification.content}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocation("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/logout")}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </ThemeContext.Provider>
  );
}
