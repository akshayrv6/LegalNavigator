import { Card, CardContent } from "@/components/ui/card";
import type { Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const formattedContent = message.content.split('\n').map((line, index) => {
    if (line.trim().length === 0) return null;
    if (line.match(/^\d+\./)) {
      return (
        <li key={index} className="mb-2 list-decimal">
          {line.replace(/^\d+\./, '').trim()}
        </li>
      );
    }
    return <p key={index} className="mb-2">{line}</p>;
  });

  return (
    <Card className={message.isUserMessage ? "ml-auto" : "mr-auto"} style={{ maxWidth: "80%" }}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            {message.isUserMessage ? "You" : "Legal Assistant"}
          </span>
          <div className="text-foreground">
            {message.content.includes('\n') ? (
              <div className="prose prose-sm dark:prose-invert">
                <ol className="list-decimal list-inside space-y-2">
                  {formattedContent}
                </ol>
              </div>
            ) : (
              <p>{message.content}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}