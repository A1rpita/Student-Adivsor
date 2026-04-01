import { Link, useLocation } from "wouter";
import { Compass, Target, GraduationCap, MessageSquare, Home, Menu, X, Sparkles, Mail, Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Career Advisor", href: "/career", icon: Compass },
  { name: "Skill Intelligence", href: "/skills", icon: Target },
  { name: "Scholarships", href: "/scholarships", icon: GraduationCap },
  { name: "Email Generator", href: "/email", icon: Mail },
  { name: "AI Chatbot", href: "/chatbot", icon: MessageSquare },
];

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({ title: "AI Student Advisor", text: "Check out this AI-powered student advisor!", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-white dark:bg-indigo-950 hover:shadow-sm transition-all mt-2"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> : <Share2 className="w-3.5 h-3.5 shrink-0" />}
      {copied ? "Link copied!" : "Copy share link"}
    </button>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 border-r border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold leading-tight">Student Advisor</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AI Powered</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-4">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-border/50">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
            <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">Need help?</p>
            <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-1 mb-3">Chat with our AI advisor instantly.</p>
            <Link href="/chatbot">
              <div className="text-xs font-bold bg-white dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 py-2 px-3 rounded-lg text-center cursor-pointer hover:shadow-sm transition-all">
                Open Chat
              </div>
            </Link>
            <ShareButton />
          </div>
        </div>
      </aside>

      {/* Mobile Nav Header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold">Advisor AI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 p-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 active:bg-secondary">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
          <div className="mt-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Share this app</p>
            <ShareButton />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:pl-72 flex flex-col min-h-screen pt-16 md:pt-0 relative">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-background to-background -z-10" />
        
        <div className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
