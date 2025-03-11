import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import Navbar from "@/components/layout/Navbar";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  // Clear all chat data when the app mounts (new tab or refresh)
  useEffect(() => {
    const clearChat = async () => {
      try {
        queryClient.clear(); // Clear all queries in cache
        sessionStorage.clear(); // Clear session storage
        // Clear server-side messages
        await fetch('/api/messages/clear', { method: 'POST' });
      } catch (error) {
        console.error('Failed to clear chat history:', error);
      }
    };

    clearChat();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/chat" component={Chat} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;