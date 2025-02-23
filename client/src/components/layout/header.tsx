import { Bell, User } from "lucide-react";
import { useNotifications } from "@/lib/notification";
import { useLocation } from "wouter";
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

export function Header() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [, setLocation] = useLocation();

  return (
    <header className="fixed top-0 left-64 right-0 z-40 flex h-16 items-center gap-x-4 border-b bg-background px-6">
      <div className="flex flex-1 gap-x-4 self-stretch justify-end">
        <div className="flex items-center gap-x-4">
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
                    className={`flex items-start gap-4 p-4 rounded-lg ${
                      notification.read ? 'bg-muted' : 'bg-accent'
                    } cursor-pointer`}
                    onClick={() => {
                      markAsRead(notification.id);
                      // Navigate based on platform
                      switch (notification.platform) {
                        case 'gmail':
                          setLocation('/gmail');
                          break;
                        case 'slack':
                          setLocation('/slack');
                          break;
                        case 'whatsapp':
                          setLocation('/whatsapp');
                          break;
                      }
                    }}
                  >
                    <Bell className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No notifications
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">User Name</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation('/profile')}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation('/settings')}>
                Notification Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation('/settings')}>
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}