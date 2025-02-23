import { Bell, User } from "lucide-react";
import { useNotifications } from "@/lib/notification";
import { useLocation } from "wouter";
import React, { useState, createContext, useContext } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme?.(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Button onClick={toggleTheme} variant="ghost">
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
}

export function Header() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
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
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="flex flex-row justify-between items-center">
                  <SheetTitle>Notifications</SheetTitle>
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 rounded-lg"
                    >
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