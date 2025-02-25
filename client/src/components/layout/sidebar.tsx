import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Settings,
  LayoutDashboard
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Gmail", href: "/gmail", icon: Mail },
  { name: "Slack", href: "/slack", icon: MessageSquare },
  { name: "WhatsApp", href: "/whatsapp", icon: Phone },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <span className="text-xl font-bold">Comm Assistant</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7 px-6 py-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className={cn(
                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                    location === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                <item.icon className="h-6 w-6 shrink-0" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}