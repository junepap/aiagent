import { SlackView } from "@/components/platforms/slack-view";

export default function SlackPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Slack Integration</h1>
      <SlackView />
    </div>
  );
}
