import { WhatsAppView } from "@/components/platforms/whatsapp-view";

export default function WhatsAppPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">WhatsApp Integration</h1>
      <WhatsAppView />
    </div>
  );
}
