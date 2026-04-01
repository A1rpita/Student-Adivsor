import { useRoute, Link } from "wouter";
import { useGetCareerRoadmap } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Award, GraduationCap, CheckCircle2, Clock } from "lucide-react";
import { Button, Card, Badge, Skeleton } from "@/components/ui";

export default function Roadmap() {
  const [match, params] = useRoute("/career/roadmap/:career");
  const careerName = params?.career ? decodeURIComponent(params.career) : "";

  const { data, isLoading, error } = useGetCareerRoadmap(careerName, {
    query: { enabled: !!careerName }
  });

  if (isLoading) return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-6">
        {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-destructive">Failed to load roadmap</h2>
      <Link href="/career"><Button className="mt-4">Go Back</Button></Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20">
      <Link href="/career">
        <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Matches
        </Button>
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">{data.career} Roadmap</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">{data.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" /> Step-by-step Plan
            </h2>
            <div className="space-y-4">
              {data.steps.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    {i !== data.steps.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                  </div>
                  <Card className="flex-1 p-5 mb-4 hover:border-primary/40 transition-colors">
                    <p className="font-medium text-lg">{step}</p>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <Card className="p-6 bg-secondary/30 border-none">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Core Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.requiredSkills.map(skill => (
                <Badge key={skill} variant="outline" className="bg-white dark:bg-card">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" /> Top Certifications
            </h3>
            <ul className="space-y-3">
              {data.certifications.map((cert, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  {cert}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-500" /> Recommended Exams
            </h3>
            <ul className="space-y-3">
              {data.exams.map((exam, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  {exam}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// Temporary icon component since we missed Target in the import for this file
function Target(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
}
