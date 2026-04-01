import { useState } from "react";
import { useListSkillCareers, useRecommendSkills } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, X, Plus, BookOpen, AlertCircle, PlayCircle } from "lucide-react";
import { Button, Card, Badge, Select, Input, Skeleton } from "@/components/ui";

export default function SkillIntelligence() {
  const { data: careersData, isLoading: loadingCareers } = useListSkillCareers();
  const { mutate: analyzeSkills, data: result, isPending } = useRecommendSkills();

  const [career, setCareer] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");
  const [userSkills, setUserSkills] = useState<string[]>([]);

  const addSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (currentSkill.trim() && !userSkills.includes(currentSkill.trim())) {
      setUserSkills([...userSkills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setUserSkills(userSkills.filter(s => s !== skill));
  };

  const handleAnalyze = () => {
    if (!career) return;
    analyzeSkills({ data: { career, userSkills } });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="space-y-4">
        <h1 className="text-4xl font-display font-bold flex items-center gap-3">
          <Target className="w-10 h-10 text-primary" /> Skill Intelligence
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover your skill gaps for any role and generate a personalized, step-by-step learning path.
        </p>
      </div>

      <Card className="p-6 md:p-8 bg-card shadow-xl border-primary/10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Target Career Role</label>
            {loadingCareers ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <Select value={career} onChange={(e) => setCareer(e.target.value)}>
                <option value="" disabled>Select a career to analyze...</option>
                {careersData?.careers.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Your Current Skills</label>
            <div className="flex gap-2">
              <Input 
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={addSkill}
                placeholder="e.g. Python, SQL, React..."
              />
              <Button type="button" onClick={addSkill} variant="secondary" size="icon" className="shrink-0">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3 min-h-[40px] p-3 rounded-xl bg-secondary/30 border border-border/50">
              <AnimatePresence>
                {userSkills.length === 0 && (
                  <span className="text-sm text-muted-foreground p-1">No skills added yet.</span>
                )}
                {userSkills.map(skill => (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    key={skill}
                  >
                    <Badge variant="outline" className="pl-3 pr-1 py-1.5 bg-background flex items-center gap-1 text-sm shadow-sm">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="p-0.5 hover:bg-muted rounded-full transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button size="lg" onClick={handleAnalyze} disabled={!career || isPending} isLoading={isPending}>
            Generate Intelligence Report
          </Button>
        </div>
      </Card>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-12"
        >
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-100 dark:border-emerald-900/30">
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 mb-1">Existing Skills</p>
              <h4 className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">{result.existingSkills.length}</h4>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border-rose-100 dark:border-rose-900/30">
              <p className="text-sm font-semibold text-rose-800 dark:text-rose-400 mb-1">Missing Skills</p>
              <h4 className="text-3xl font-bold text-rose-600 dark:text-rose-500">{result.missingSkills.length}</h4>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-100 dark:border-indigo-900/30">
              <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-400 mb-1">Est. Time to Job Ready</p>
              <h4 className="text-3xl font-bold text-indigo-600 dark:text-indigo-500">{result.totalWeeks} Weeks</h4>
            </Card>
          </div>

          {/* Gap Analysis */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Skill Gap Analysis</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" /> You Already Know
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.existingSkills.length ? result.existingSkills.map(s => (
                    <Badge key={s} variant="success" className="px-3 py-1.5">{s}</Badge>
                  )) : <p className="text-muted-foreground text-sm">None matched.</p>}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2 text-rose-600">
                  <AlertCircle className="w-5 h-5" /> What You Need to Learn
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.length ? result.missingSkills.map(s => (
                    <Badge key={s} variant="destructive" className="bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 px-3 py-1.5">{s}</Badge>
                  )) : <p className="text-muted-foreground text-sm">You have all required skills!</p>}
                </div>
              </div>
            </div>
          </section>

          {/* Learning Roadmap Table */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Optimized Learning Roadmap</h3>
            <Card className="overflow-hidden border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/60">
                    <tr>
                      <th className="px-6 py-4">Skill to Learn</th>
                      <th className="px-6 py-4">Difficulty</th>
                      <th className="px-6 py-4">Industry Demand</th>
                      <th className="px-6 py-4 text-right">Est. Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {result.roadmap.map((item, i) => (
                      <tr key={item.skill} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{i+1}</span>
                          {item.skill}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={item.difficulty === 'Beginner' ? 'success' : item.difficulty === 'Intermediate' ? 'warning' : 'destructive'}>
                            {item.difficulty}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${item.demandScore}%` }} />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">{item.demandScore}/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">{item.weeks} weeks</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* Recommended Courses Grid */}
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-primary" /> Top Course Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.courses.map((course, i) => (
                <Card key={i} className="p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <Badge className="mb-3" variant="secondary">{course.skill}</Badge>
                  <h4 className="font-bold text-lg mb-2 line-clamp-2 leading-tight">{course.course}</h4>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> {course.platform}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </motion.div>
      )}
    </div>
  );
}

// Ensure CheckCircle2 is imported if we missed it
import { CheckCircle2 as CheckCircle2Icon } from "lucide-react";
const CheckCircle2 = CheckCircle2Icon;
