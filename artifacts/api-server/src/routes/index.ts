import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import careerRouter from "./career.js";
import skillsRouter from "./skills.js";
import scholarshipsRouter from "./scholarships.js";
import chatbotRouter from "./chatbot.js";
import emailRouter from "./email.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/career", careerRouter);
router.use("/skills", skillsRouter);
router.use("/scholarships", scholarshipsRouter);
router.use("/chatbot", chatbotRouter);
router.use("/email", emailRouter);

export default router;
