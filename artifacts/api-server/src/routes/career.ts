import { Router, type IRouter } from "express";
import {
  SubmitAssessmentBody,
  GetCareerRoadmapParams,
  SubmitAssessmentResponse,
  GetCareerRoadmapResponse,
  ListCareersResponse,
} from "@workspace/api-zod";
import {
  assessmentQuestions,
  careerDatabase,
} from "../data/careerData.js";

const router: IRouter = Router();

router.get("/list", (_req, res) => {
  const careers = Object.keys(careerDatabase);
  const data = ListCareersResponse.parse({ careers });
  res.json(data);
});

router.post("/assessment", (req, res) => {
  const body = SubmitAssessmentBody.parse(req.body);
  const { answers } = body;

  const scores: Record<string, number> = { logic: 0, creative: 0, tech: 0, communication: 0 };

  assessmentQuestions.forEach((q, idx) => {
    if (answers[idx] !== undefined) {
      scores[q.type] = (scores[q.type] ?? 0) + (answers[idx] ?? 0);
    }
  });

  const dominantTrait = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "logic";

  const careerMatches = Object.entries(careerDatabase).map(([career, info]) => {
    let matchScore = 0;
    const totalWeight = Object.values(info.scores).reduce((a, b) => a + b, 0);

    for (const [trait, weight] of Object.entries(info.scores)) {
      const userScore = scores[trait] ?? 0;
      const maxScore = assessmentQuestions.filter((q) => q.type === trait).length * 5;
      const normalized = maxScore > 0 ? (userScore / maxScore) * weight : 0;
      matchScore += normalized;
    }

    const percentage = Math.round((matchScore / totalWeight) * 100);

    return {
      career,
      matchScore: Math.min(99, Math.max(1, percentage)),
      description: info.description,
      requiredSkills: info.requiredSkills,
    };
  });

  careerMatches.sort((a, b) => b.matchScore - a.matchScore);
  const topCareers = careerMatches.slice(0, 5);

  const data = SubmitAssessmentResponse.parse({
    scores,
    topCareers,
    dominantTrait,
  });

  res.json(data);
});

router.get("/roadmap/:career", (req, res) => {
  const { career } = GetCareerRoadmapParams.parse(req.params);

  const info = careerDatabase[career];
  if (!info) {
    res.status(404).json({ error: "Career not found" });
    return;
  }

  const data = GetCareerRoadmapResponse.parse({
    career,
    description: info.description,
    requiredSkills: info.requiredSkills,
    steps: info.steps,
    certifications: info.certifications,
    exams: info.exams,
  });

  res.json(data);
});

export default router;
