import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/lib/notification";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import GmailPage from "@/pages/gmail";
import SlackPage from "@/pages/slack";
import WhatsAppPage from "@/pages/whatsapp";
import SettingsPage from "@/pages/settings";
import ProfilePage from "@/pages/profile";
import OnboardingPage from "@/pages/onboarding";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(
      "hasCompletedOnboarding",
    );
    const isOnboarding = location === "/onboarding";

    if (!hasCompletedOnboarding && !isOnboarding) {
      setLocation("/onboarding");
    } else if (hasCompletedOnboarding && isOnboarding) {
      setLocation("/");
    }
  }, [location, setLocation]);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="pt-16">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/gmail" component={GmailPage} />
            <Route path="/slack" component={SlackPage} />
            <Route path="/whatsapp" component={WhatsAppPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/onboarding" component={OnboardingPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}
