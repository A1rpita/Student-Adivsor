import { Router, type IRouter } from "express";
import {
  RecommendSkillsBody,
  RecommendSkillsResponse,
  ListSkillCareersResponse,
} from "@workspace/api-zod";
import {
  careerSkillDataset,
  skillDemandData,
  skillDifficultyData,
  skillDependencies,
  coursesData,
  certificationsData,
  examsData,
} from "../data/careerData.js";

const router: IRouter = Router();

router.get("/careers", (_req, res) => {
  const careers = Object.keys(careerSkillDataset).sort();
  const data = ListSkillCareersResponse.parse({ careers });
  res.json(data);
});

router.post("/recommend", (req, res) => {
  const body = RecommendSkillsBody.parse(req.body);
  const { career, userSkills } = body;

  const careerSkills = careerSkillDataset[career] ?? [];
  const existingSkills = userSkills.filter((s) => careerSkills.includes(s));
  const missingSkills = careerSkills.filter((s) => !userSkills.includes(s));

  const fullPath = new Set<string>(missingSkills);

  for (const skill of missingSkills) {
    const prereqs = skillDependencies[skill] ?? [];
    for (const prereq of prereqs) {
      if (!userSkills.includes(prereq)) {
        fullPath.add(prereq);
      }
    }
  }

  const finalMissing = Array.from(fullPath);

  const rankedSkills = finalMissing
    .map((skill) => ({ skill, demandScore: skillDemandData[skill] ?? 50 }))
    .sort((a, b) => b.demandScore - a.demandScore);

  const roadmap = rankedSkills.map(({ skill, demandScore }) => {
    const diffInfo = skillDifficultyData[skill];
    return {
      skill,
      difficulty: (diffInfo?.difficulty ?? "Intermediate") as "Beginner" | "Intermediate" | "Advanced",
      weeks: diffInfo?.weeks ?? 4,
      demandScore,
    };
  });

  const recommendedCourses = coursesData.filter((c) =>
    finalMissing.includes(c.skill)
  );

  const certifications = certificationsData[career] ?? [];
  const exams = examsData[career] ?? [];
  const totalWeeks = roadmap.reduce((sum, item) => sum + item.weeks, 0);

  const data = RecommendSkillsResponse.parse({
    career,
    existingSkills,
    missingSkills: finalMissing,
    roadmap,
    courses: recommendedCourses,
    certifications,
    exams,
    totalWeeks,
  });

  res.json(data);
});

export default router;
