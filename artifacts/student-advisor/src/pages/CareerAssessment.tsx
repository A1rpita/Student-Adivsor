import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, BrainCircuit, CheckCircle2, ChevronRight, RefreshCw } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { useSubmitAssessment } from "@workspace/api-client-react";

const QUESTIONS = [
  { id: 1, text: "I enjoy solving complex logical problems." },
  { id: 2, text: "I like creating designs, art, or visual content." },
  { id: 3, text: "I enjoy working with computers and learning new software." },
  { id: 4, text: "I like talking to people and explaining things clearly." },
  { id: 5, text: "I enjoy analyzing data to find trends and patterns." },
];

export default function CareerAssessment() {
  const [answers, setAnswers] = useState<number[]>(Array(5).fill(3));
  const { mutate: submitAssessment, data: result, isPending } = useSubmitAssessment();

  const handleSliderChange = (index: number, val: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = val;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    submitAssessment({ data: { answers } });
  };

  if (result) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <BrainCircuit className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold">Your Career Matches</h1>
          <p className="text-xl text-muted-foreground">
            Based on your profile, your dominant trait is <span className="font-bold text-primary capitalize">{result.dominantTrait}</span>.
          </p>
        </div>

        <div className="grid gap-6">
          {result.topCareers.map((match, i) => (
            <motion.div
              key={match.career}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary transform origin-left transition-transform group-hover:scale-x-150" />
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{match.career}</h3>
                    <Badge variant={match.matchScore > 80 ? "success" : "default"} className="text-sm px-3 py-1">
                      {Math.round(match.matchScore)}% Match
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{match.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {match.requiredSkills.slice(0, 5).map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-secondary/50 text-secondary-foreground/80">
                        {skill}
                      </Badge>
                    ))}
                    {match.requiredSkills.length > 5 && (
                      <Badge variant="secondary" className="bg-secondary/50">+{match.requiredSkills.length - 5} more</Badge>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-auto flex-shrink-0 mt-4 md:mt-0">
                  <Link href={`/career/roadmap/${encodeURIComponent(match.career)}`}>
                    <Button className="w-full md:w-auto shadow-md hover:shadow-lg">
                      View Roadmap <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Button variant="ghost" onClick={() => setAnswers(Array(5).fill(3))}>
            <RefreshCw className="mr-2 w-4 h-4" /> Retake Assessment
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 space-y-4">
        <Badge>Step 1 of 4</Badge>
        <h1 className="text-4xl font-display font-bold">Career Assessment</h1>
        <p className="text-lg text-muted-foreground">
          Rate how much you agree with the following statements to discover your ideal career path.
        </p>
      </div>

      <Card className="p-8 shadow-xl border-primary/10">
        <div className="space-y-12">
          {QUESTIONS.map((q, i) => (
            <div key={q.id} className="space-y-6">
              <h3 className="text-lg font-medium text-foreground">
                <span className="text-primary mr-2">{i + 1}.</span> {q.text}
              </h3>
              
              <div className="relative pt-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={answers[i]}
                  onChange={(e) => handleSliderChange(i, parseInt(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Strongly Disagree</span>
                  <span>Neutral</span>
                  <span>Strongly Agree</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex justify-end">
          <Button size="lg" onClick={handleSubmit} isLoading={isPending} className="w-full md:w-auto">
            {isPending ? "Analyzing Profile..." : "Reveal Career Matches"}
            {!isPending && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}
