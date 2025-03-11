import { Link } from "wouter";
import { Scale } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 text-xl font-semibold">
            <Scale className="h-6 w-6" />
            <span>LegalAssist</span>
          </a>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/">
            <a className="text-foreground/80 hover:text-foreground">Home</a>
          </Link>
          <Link href="/chat">
            <a className="text-foreground/80 hover:text-foreground">Chat</a>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}