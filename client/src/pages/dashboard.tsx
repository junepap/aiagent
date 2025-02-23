import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Mail,
  MessageSquare,
  Phone,
  Settings,
  UserCircle
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Communication Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/gmail">
          <Card className="cursor-pointer hover:opacity-80 transition-opacity">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gmail</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/slack">
          <Card className="cursor-pointer hover:opacity-80 transition-opacity">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Slack</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Channel updates</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/whatsapp">
          <Card className="cursor-pointer hover:opacity-80 transition-opacity">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Pending messages</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings">
          <Card className="cursor-pointer hover:opacity-80 transition-opacity">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Configure AI models and integrations
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profile">
          <Card className="cursor-pointer hover:opacity-80 transition-opacity">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <UserCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Manage your account settings
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}