import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Gavel, Scale, FileText } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";

export default function Home() {
  // Clear chat history when landing on home page
  useEffect(() => {
    queryClient.setQueryData(["/api/messages"], []);
    sessionStorage.removeItem('chatSessionId');
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Legal Advice Assistant
        </h1>
        <p className="text-muted-foreground text-lg">
          Get instant legal guidance across multiple jurisdictions
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6">
            <Gavel className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Multiple Jurisdictions</h2>
            <p className="text-muted-foreground">
              Legal advice for different countries and regions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Scale className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Various Categories</h2>
            <p className="text-muted-foreground">
              From traffic laws to business regulations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FileText className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Easy Interface</h2>
            <p className="text-muted-foreground">
              Chat-based interface for quick answers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Link href="/chat">
          <Button size="lg" className="text-lg px-8">
            Start Chat
          </Button>
        </Link>
      </div>
    </div>
  );
}