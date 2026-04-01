import { Router, type IRouter } from "express";
import {
  SearchScholarshipsBody,
  SearchScholarshipsResponse,
} from "@workspace/api-zod";
import { scholarships } from "../data/careerData.js";

const router: IRouter = Router();

router.post("/search", (req, res) => {
  const body = SearchScholarshipsBody.parse(req.body);
  const { gender, category, keyword, maxIncome } = body;

  let results = [...scholarships];

  if (gender && gender !== "All") {
    results = results.filter(
      (s) => s.gender.toLowerCase() === gender.toLowerCase() || s.gender === "All"
    );
  }

  if (category && category.trim()) {
    results = results.filter(
      (s) => s.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (maxIncome && maxIncome > 0) {
    results = results.filter(
      (s) => (s.maxIncomeLimit ?? 9999999) >= maxIncome
    );
  }

  if (keyword && keyword.trim()) {
    const kw = keyword.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(kw) ||
        s.eligibility.toLowerCase().includes(kw) ||
        s.provider.toLowerCase().includes(kw) ||
        s.amount.toLowerCase().includes(kw) ||
        (s.category ?? "").toLowerCase().includes(kw)
    );
  }

  const data = SearchScholarshipsResponse.parse({
    scholarships: results,
    total: results.length,
  });

  res.json(data);
});

export default router;
