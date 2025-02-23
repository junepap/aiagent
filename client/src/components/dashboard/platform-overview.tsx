import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PlatformStats } from "@shared/types";

interface PlatformOverviewProps {
  platform: string;
  stats: PlatformStats;
  data: Array<{ date: string; messages: number }>;
}

export function PlatformOverview({ platform, stats, data }: PlatformOverviewProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{platform} Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <div>
            <p className="text-sm font-medium">Total Messages</p>
            <p className="text-2xl font-bold">{stats.totalMessages}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Unread</p>
            <p className="text-2xl font-bold">{stats.unreadMessages}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Average Sentiment</p>
            <p className="text-2xl font-bold">{stats.averageSentiment.toFixed(1)}</p>
          </div>
        </div>
        
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="messages" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
