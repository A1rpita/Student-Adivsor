import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Compass, Target, GraduationCap, MessageSquare } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function Home() {
  const features = [
    {
      title: "Career Assessment",
      description: "Take our personality quiz to discover careers that match your unique strengths and traits.",
      icon: Compass,
      href: "/career",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Skill Intelligence",
      description: "Analyze your current skills against industry demands and get a customized learning roadmap.",
      icon: Target,
      href: "/skills",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Scholarship Finder",
      description: "Find financial aid tailored to your profile, category, and academic interests.",
      icon: GraduationCap,
      href: "/scholarships",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "AI Chatbot",
      description: "Ask anything about your career path, interview prep, or tech skills anytime.",
      icon: MessageSquare,
      href: "/chatbot",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <section className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Abstract academic background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
        </div>
        
        <div className="relative z-10 px-8 py-16 md:py-24 lg:px-16 max-w-3xl">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-none backdrop-blur-sm">
            v2.0 Beta Live
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6 text-white">
            Shape Your Future with AI Intelligence
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-2xl">
            Discover the perfect career path, identify skill gaps, and find scholarships tailored to your unique profile—all powered by advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/career">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto shadow-xl shadow-black/10">
                Start Career Assessment <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/chatbot">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm">
                Chat with AI Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold">Explore Tools</h2>
            <p className="text-muted-foreground mt-2">Everything you need to accelerate your career.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link href={feature.href}>
                <Card className="p-8 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-border/60 hover:border-primary/30">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.bg)}>
                    <feature.icon className={cn("w-7 h-7", feature.color)} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function Badge({ children, className, variant }: any) {
  return <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide", className)}>{children}</span>;
}
