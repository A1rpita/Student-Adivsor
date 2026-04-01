import { useState, useEffect } from "react";
import { useSearchScholarships } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { GraduationCap, Search, Filter, MapPin, Tag } from "lucide-react";
import { Button, Card, Badge, Input, Select } from "@/components/ui";

export default function ScholarshipFinder() {
  const [filters, setFilters] = useState({
    gender: "All" as "All" | "Male" | "Female" | "Other",
    category: "",
    keyword: "",
    maxIncome: "",
  });

  const { mutate: search, data, isPending } = useSearchScholarships();

  // Auto-load all scholarships on first mount
  useEffect(() => {
    search({ data: { gender: "All" } });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search({
      data: {
        gender: filters.gender,
        category: filters.category || undefined,
        keyword: filters.keyword || undefined,
        maxIncome: filters.maxIncome ? parseInt(filters.maxIncome) : undefined,
      },
    });
  };

  const handleReset = () => {
    setFilters({ gender: "All", category: "", keyword: "", maxIncome: "" });
    search({ data: { gender: "All" } });
  };

  const categoryColors: Record<string, string> = {
    General: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    OBC: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    SC: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    ST: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    Minority: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 p-8 md:p-12 text-white shadow-xl">
        <div className="relative z-10">
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6">
            <GraduationCap className="w-8 h-8 text-indigo-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-4">Scholarship Finder</h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Discover financial aid programs tailored to your profile. Filter by gender, category, income, or keywords to find the best matches.
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-indigo-500/30 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none" />
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24 shadow-md border-border/60">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b pb-4">
              <Filter className="w-5 h-5 text-primary" /> Filter Options
            </h3>
            <form onSubmit={handleSearch} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Gender</label>
                <Select
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value as any })}
                >
                  <option value="All">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Category</label>
                <Select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Minority">Minority</option>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Max Family Income (₹)</label>
                <Input
                  type="number"
                  placeholder="e.g. 500000"
                  value={filters.maxIncome}
                  onChange={(e) => setFilters({ ...filters, maxIncome: e.target.value })}
                />
                {filters.maxIncome && (
                  <p className="text-xs text-muted-foreground">Shows scholarships available for families earning up to ₹{parseInt(filters.maxIncome).toLocaleString("en-IN")}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Keywords</label>
                <Input
                  type="text"
                  placeholder="e.g. Engineering, GATE..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={isPending}>
                <Search className="w-4 h-4 mr-2" /> Find Scholarships
              </Button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Reset filters & show all
              </button>
            </form>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3">
          {isPending && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
                </Card>
              ))}
            </div>
          )}

          {!isPending && data && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-bold text-foreground">
                  Found <span className="text-primary">{data.total}</span> Scholarship{data.total !== 1 ? "s" : ""}
                </h3>
                {data.total === 0 && (
                  <p className="text-sm text-muted-foreground">Try broadening your filters</p>
                )}
              </div>

              {data.scholarships.length === 0 ? (
                <Card className="p-12 text-center bg-secondary/20">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-lg text-muted-foreground font-medium">No scholarships match your exact criteria.</p>
                  <p className="text-sm text-muted-foreground mt-2">Try changing your category, gender, or income filters.</p>
                  <button onClick={handleReset} className="mt-4 text-sm text-primary underline underline-offset-2">Show all scholarships</button>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {data.scholarships.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-border/60">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div>
                              <h4 className="text-xl font-bold text-primary mb-1">{item.name}</h4>
                              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" /> {item.provider}
                              </p>
                            </div>

                            <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/50 p-3 rounded-xl border border-border/50">
                              <span className="font-semibold block mb-1">Eligibility:</span>
                              {item.eligibility}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-1">
                              {item.category && (
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[item.category] ?? categoryColors["General"]}`}>
                                  <Tag className="w-3 h-3" /> {item.category}
                                </span>
                              )}
                              {item.gender !== "All" && (
                                <Badge variant="outline" className="text-xs">Gender: {item.gender}</Badge>
                              )}
                            </div>
                          </div>

                          <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30 flex flex-col items-center justify-center shrink-0 min-w-[140px]">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Amount</span>
                            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300 text-center">{item.amount}</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
