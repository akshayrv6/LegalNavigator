import ChatInterface from "@/components/chat/ChatInterface";

export default function Chat() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Legal Chat Assistant</h1>
      <ChatInterface />
    </div>
  );
}
