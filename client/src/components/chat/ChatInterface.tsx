import { useState, useEffect } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { countries, categories } from "@shared/mockLegalData";
import ChatMessage from "./ChatMessage";
import type { Message } from "@shared/schema";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState("US");
  const [category, setCategory] = useState("traffic");
  const { toast } = useToast();

  // Generate a unique session ID for each new user
  useEffect(() => {
    const sessionId = Date.now().toString();
    sessionStorage.setItem('chatSessionId', sessionId);
    // Clear previous messages when component mounts
    queryClient.setQueryData(["/api/messages"], []);
  }, []);

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchOnWindowFocus: false,
    gcTime: 0, // Don't keep the data in cache
    staleTime: 0 // Always fetch fresh data
  });

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", {
        content,
        country,
        category
      });
      return res.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      mutation.mutate(message);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-card">
      <div className="p-4 border-b">
        <div className="flex gap-4">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c: { code: string; name: string }) => (
                <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c: { id: string; name: string }) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : messages?.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Start a conversation by asking a legal question
          </div>
        ) : (
          messages?.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your legal question..."
            disabled={mutation.isPending}
          />
          <Button type="submit" disabled={mutation.isPending}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}