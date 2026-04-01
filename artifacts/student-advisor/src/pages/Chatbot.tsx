import { useState, useRef, useEffect } from "react";
import { useSendChatMessage } from "@workspace/api-client-react";
import type { ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button, Input, Card, Badge } from "@/components/ui";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant" as ChatMessageRole, content: "Hi! I'm your AI Career Advisor. Ask me anything about careers, skills, scholarships, or interview prep!" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { mutate: sendMessage, isPending } = useSendChatMessage({
    mutation: {
      onSuccess: (data) => {
        setMessages(prev => [...prev, { role: "assistant" as ChatMessageRole, content: data.response }]);
      }
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const newMsg: ChatMessage = { role: "user" as ChatMessageRole, content: input.trim() };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    
    // We send current history excluding the new message since the backend might expect just prior context
    sendMessage({ data: { message: newMsg.content, history: messages } });
  };

  const suggestions = [
    "What careers suit someone who likes math?",
    "Tell me about Software Engineering.",
    "How do I become a Data Scientist?",
    "Show me scholarships for women."
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col pb-4">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary" /> AI Career Advisor
        </h1>
        <p className="text-muted-foreground mt-1">Get instant guidance powered by natural language intelligence.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-primary/10 shadow-xl bg-card">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-50 to-white dark:from-slate-900/50 dark:to-card">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white border border-border text-primary'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                <div className={`px-5 py-3.5 rounded-2xl leading-relaxed text-[15px] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-white dark:bg-slate-800 border border-border/50 text-foreground rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            
            {isPending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[80%] mr-auto">
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-white border border-border text-primary shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-border/50 rounded-tl-sm shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t border-border">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map(text => (
                <Badge 
                  key={text} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors py-1.5"
                  onClick={() => setInput(text)}
                >
                  {text}
                </Badge>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-3 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 pr-14 h-14 text-base rounded-2xl bg-secondary/50 border-transparent focus-visible:bg-background"
              disabled={isPending}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-1.5 top-1.5 h-11 w-11 rounded-xl shadow-none" 
              disabled={!input.trim() || isPending}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
            AI can make mistakes. Consider verifying important career or scholarship deadlines.
          </p>
        </div>
      </Card>
    </div>
  );
}
