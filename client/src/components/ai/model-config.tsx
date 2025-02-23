import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AiModel } from "@shared/schema";

export function ModelConfig() {
  const [newModel, setNewModel] = useState({
    name: "",
    endpoint: "",
    apiKey: "",
  });

  const { data: models, refetch } = useQuery({
    queryKey: ["/api/ai/models"],
  });

  const handleAddModel = async () => {
    try {
      await fetch("/api/ai/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newModel),
      });
      setNewModel({ name: "", endpoint: "", apiKey: "" });
      refetch();
    } catch (error) {
      console.error("Failed to add model:", error);
    }
  };

  const handleToggleModel = async (model: AiModel) => {
    try {
      await fetch(`/api/ai/models/${model.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !model.active }),
      });
      refetch();
    } catch (error) {
      console.error("Failed to toggle model:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Configuration</CardTitle>
        <CardDescription>
          Configure and manage your AI models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Model Name</Label>
            <Input
              id="name"
              value={newModel.name}
              onChange={(e) =>
                setNewModel({ ...newModel, name: e.target.value })
              }
              placeholder="e.g., Grok-2"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endpoint">API Endpoint</Label>
            <Input
              id="endpoint"
              value={newModel.endpoint}
              onChange={(e) =>
                setNewModel({ ...newModel, endpoint: e.target.value })
              }
              placeholder="https://api.example.com/v1"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={newModel.apiKey}
              onChange={(e) =>
                setNewModel({ ...newModel, apiKey: e.target.value })
              }
              placeholder="sk-..."
            />
          </div>
          <Button onClick={handleAddModel}>Add Model</Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Configured Models</h3>
          {models?.map((model: AiModel) => (
            <div
              key={model.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div>
                <h4 className="font-medium">{model.name}</h4>
                <p className="text-sm text-muted-foreground">{model.endpoint}</p>
              </div>
              <Switch
                checked={model.active}
                onCheckedChange={() => handleToggleModel(model)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
