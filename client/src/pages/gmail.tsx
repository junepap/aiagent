import { GmailView } from "@/components/platforms/gmail-view";

export default function GmailPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gmail Integration</h1>
      <GmailView />
    </div>
  );
}
