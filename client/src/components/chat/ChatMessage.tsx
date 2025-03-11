import { Card, CardContent } from "@/components/ui/card";
import type { Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <Card className={message.isUserMessage ? "ml-auto" : "mr-auto"} style={{ maxWidth: "80%" }}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            {message.isUserMessage ? "You" : "Legal Assistant"}
          </span>
          <p className="text-foreground">{message.content}</p>
        </div>
      </CardContent>
    </Card>
  );
}
