import { useState } from "react";
import { useGenerateEmails } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Plus, X, Copy, Check, Building2, Briefcase, Send, Loader2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

type Tone = "formal" | "friendly" | "confident";
type CompanySize = "startup" | "small" | "medium" | "large";

interface GeneratedEmail {
  company: string;
  industry: string;
  companySize: string;
  subject: string;
  body: string;
  hrEmail?: string;
  managerEmail?: string;
}

const toneLabels: Record<Tone, string> = {
  formal: "Formal",
  friendly: "Friendly",
  confident: "Confident",
};

const sizeLabels: Record<CompanySize, string> = {
  startup: "Startup (1–50 employees)",
  small: "Small (51–200 employees)",
  medium: "Medium (201–1,000 employees)",
  large: "Large Enterprise (1,000+)",
};

function EmailCard({ email, index }: { email: GeneratedEmail; index: number }) {
  const [subject, setSubject] = useState(email.subject);
  const [body, setBody] = useState(email.body);
  const [hrEmail, setHrEmail] = useState(email.hrEmail ?? "");
  const [managerEmail, setManagerEmail] = useState(email.managerEmail ?? "");
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(index === 0);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSendEmail = () => {
    const recipients = [hrEmail, managerEmail].filter(Boolean).join(",");
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    window.open(`mailto:${recipients}?subject=${encodedSubject}&body=${encodedBody}`, "_blank");
  };

  const canSend = hrEmail.trim() || managerEmail.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className="overflow-hidden border-border/60">
        {/* Header — div not button to avoid nested button issue */}
        <div
          className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors cursor-pointer"
          onClick={() => setExpanded((e) => !e)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{email.company}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge className="text-xs px-2 py-0">{email.industry}</Badge>
                <span className="text-xs text-muted-foreground">{email.companySize}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs h-8"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">
                {/* HR Email Recipients — pre-filled from company data */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 space-y-3">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Send Directly to HR
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 block">HR Email</label>
                      <input
                        type="email"
                        className="w-full text-sm border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-2 bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all"
                        placeholder="hr@company.com"
                        value={hrEmail}
                        onChange={(e) => setHrEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 block">Company Manager Email</label>
                      <input
                        type="email"
                        className="w-full text-sm border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-2 bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all"
                        placeholder="manager@company.com"
                        value={managerEmail}
                        onChange={(e) => setManagerEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={!canSend}
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Email Client & Send
                  </Button>
                  {!canSend && (
                    <p className="text-xs text-blue-500/70 text-center">Email addresses loaded above — edit if needed</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Subject Line</label>
                  <input
                    className="w-full text-sm border border-border/60 rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Email Body</label>
                  <textarea
                    className="w-full text-sm border border-border/60 rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none leading-relaxed"
                    rows={10}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">✏️ Edit subject, body, or email addresses before sending.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function EmailGenerator() {
  const [name, setName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [companySize, setCompanySize] = useState<CompanySize>("medium");
  const [count, setCount] = useState(3);

  const { mutate: generate, data, isPending } = useGenerateEmails();

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !jobRole.trim() || skills.length === 0) return;
    generate({
      data: {
        name: name.trim(),
        jobRole: jobRole.trim(),
        skills,
        experience: experience.trim() || undefined,
        tone,
        companySize,
        count,
      },
    });
  };

  const canGenerate = name.trim() && jobRole.trim() && skills.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-rose-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">HR Email Generator</h1>
        </div>
        <p className="text-muted-foreground text-base ml-13">
          Generate personalized cold emails — HR &amp; Manager contacts pre-filled for each company.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 border-border/60 sticky top-6">
            <h2 className="font-semibold text-base mb-5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Your Profile
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Your Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  className="w-full text-sm border border-border/60 rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Target Job Role <span className="text-destructive">*</span>
                </label>
                <input
                  className="w-full text-sm border border-border/60 rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  placeholder="e.g. Frontend Developer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Your Skills <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 text-sm border border-border/60 rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="e.g. Python, React..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button type="button" size="sm" variant="outline" onClick={addSkill} className="shrink-0 h-10 w-10 p-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full"
                      >
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {skills.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">Press Enter or + to add skills</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Brief Experience <span className="text-muted-foreground/60">(optional)</span>
                </label>
                <textarea
                  className="w-full text-sm border border-border/60 rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                  placeholder="e.g. 6-month internship at XYZ Corp, built React dashboards..."
                  rows={3}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Email Tone</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["formal", "friendly", "confident"] as Tone[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={cn(
                        "text-xs font-medium py-2 rounded-lg border transition-all",
                        tone === t
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {toneLabels[t]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Company Size</label>
                <select
                  className="w-full text-sm border border-border/60 rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value as CompanySize)}
                >
                  {(Object.entries(sizeLabels) as [CompanySize, string][]).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Number of Companies (1–10)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className="w-full text-sm border border-border/60 rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  value={count}
                  onChange={(e) => setCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={!canGenerate || isPending}
                size="lg"
              >
                {isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : (
                  <><Send className="w-4 h-4" /> Generate Emails</>
                )}
              </Button>

              {!canGenerate && (
                <p className="text-xs text-muted-foreground text-center">
                  Fill in your name, job role, and at least one skill.
                </p>
              )}
            </form>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 space-y-4"
        >
          {data?.emails && data.emails.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rose-500" />
                  <span className="font-semibold text-sm">
                    {data.total} email{data.total !== 1 ? "s" : ""} generated for{" "}
                    <span className="text-primary">{jobRole}</span>
                  </span>
                </div>
                <Badge className="text-xs">{toneLabels[tone]} tone</Badge>
              </div>

              <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border/40">
                💡 HR &amp; Manager emails are pre-filled for each company. Expand a card and click <strong>Open in Email Client</strong> to send directly.
              </p>

              <div className="space-y-3">
                {data.emails.map((email, i) => (
                  <EmailCard key={i} email={email} index={i} />
                ))}
              </div>
            </>
          ) : (
            <Card className="p-12 border-border/40 border-dashed flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-rose-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Generate & Send Cold Emails</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Fill in your profile on the left and click <span className="font-medium text-foreground">Generate Emails</span>.
                  HR &amp; Manager email contacts are pre-filled for each company — just click send.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2">
                {[
                  "Personalized per company",
                  "HR emails pre-filled",
                  "CC Company Manager",
                  "Multiple tone options",
                ].map((tip) => (
                  <div key={tip} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
