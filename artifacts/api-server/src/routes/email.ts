import { Router, type IRouter } from "express";
import {
  GenerateEmailsBody,
  GenerateEmailsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const companiesByRole: Record<string, Array<{ name: string; industry: string; hrEmail: string; managerEmail: string }>> = {
  default: [
    { name: "Infosys", industry: "IT Services", hrEmail: "careers@infosys.com", managerEmail: "talent.acquisition@infosys.com" },
    { name: "TCS", industry: "IT Services", hrEmail: "hr@tcs.com", managerEmail: "campus.recruitment@tcs.com" },
    { name: "Wipro", industry: "IT Services", hrEmail: "careers@wipro.com", managerEmail: "talent@wipro.com" },
    { name: "HCL Technologies", industry: "IT Services", hrEmail: "recruitment@hcltech.com", managerEmail: "hiring@hcltech.com" },
    { name: "Tech Mahindra", industry: "IT Services", hrEmail: "careers@techmahindra.com", managerEmail: "hr@techmahindra.com" },
    { name: "Cognizant", industry: "IT Services", hrEmail: "careers@cognizant.com", managerEmail: "hr.india@cognizant.com" },
    { name: "Capgemini", industry: "IT Consulting", hrEmail: "india.recruitment@capgemini.com", managerEmail: "careers.india@capgemini.com" },
    { name: "Accenture India", industry: "IT Consulting", hrEmail: "india.careers@accenture.com", managerEmail: "talent@accenture.com" },
    { name: "IBM India", industry: "IT Services", hrEmail: "india.careers@ibm.com", managerEmail: "ibm.hire@in.ibm.com" },
    { name: "Mphasis", industry: "IT Services", hrEmail: "careers@mphasis.com", managerEmail: "hr@mphasis.com" },
  ],
  software: [
    { name: "Microsoft India", industry: "Software", hrEmail: "india.careers@microsoft.com", managerEmail: "ms.hiring@microsoft.com" },
    { name: "Google India", industry: "Software", hrEmail: "india-jobs@google.com", managerEmail: "university-programs@google.com" },
    { name: "Amazon India", industry: "E-Commerce/Cloud", hrEmail: "india-campus@amazon.com", managerEmail: "amazon.hire@amazon.in" },
    { name: "Flipkart", industry: "E-Commerce", hrEmail: "campus@flipkart.com", managerEmail: "hiring@flipkart.com" },
    { name: "Freshworks", industry: "SaaS", hrEmail: "careers@freshworks.com", managerEmail: "talent@freshworks.com" },
    { name: "Zoho", industry: "SaaS", hrEmail: "careers@zoho.com", managerEmail: "hr@zohocorp.com" },
    { name: "Razorpay", industry: "Fintech", hrEmail: "careers@razorpay.com", managerEmail: "hiring@razorpay.com" },
    { name: "CRED", industry: "Fintech", hrEmail: "jobs@cred.club", managerEmail: "talent@cred.club" },
    { name: "Meesho", industry: "E-Commerce", hrEmail: "careers@meesho.com", managerEmail: "hr@meesho.com" },
    { name: "Dream11", industry: "Gaming", hrEmail: "careers@dream11.com", managerEmail: "talent@dream11.com" },
  ],
  data: [
    { name: "Mu Sigma", industry: "Data Analytics", hrEmail: "careers@mu-sigma.com", managerEmail: "hr@mu-sigma.com" },
    { name: "Fractal Analytics", industry: "Data Analytics", hrEmail: "careers@fractal.ai", managerEmail: "talent@fractal.ai" },
    { name: "Tiger Analytics", industry: "Data Science", hrEmail: "careers@tigeranalytics.com", managerEmail: "hr@tigeranalytics.com" },
    { name: "Latent View Analytics", industry: "Data Analytics", hrEmail: "careers@latentview.com", managerEmail: "hr@latentview.com" },
    { name: "Absolutdata", industry: "Data Science", hrEmail: "careers@absolutdata.com", managerEmail: "talent@absolutdata.com" },
    { name: "Brillio", industry: "Data Analytics", hrEmail: "careers@brillio.com", managerEmail: "hr@brillio.com" },
    { name: "EXL Analytics", industry: "Analytics", hrEmail: "careers@exlservice.com", managerEmail: "hiring@exlservice.com" },
    { name: "WNS Analytics", industry: "Analytics", hrEmail: "india.careers@wns.com", managerEmail: "hr@wns.com" },
    { name: "Accenture Analytics", industry: "IT Analytics", hrEmail: "india.careers@accenture.com", managerEmail: "analytics.hire@accenture.com" },
    { name: "KPMG Data & Analytics", industry: "Consulting", hrEmail: "kpmgindia.careers@kpmg.com", managerEmail: "india.talent@kpmg.com" },
  ],
  design: [
    { name: "Zeta", industry: "Fintech", hrEmail: "careers@zeta.tech", managerEmail: "design.hr@zeta.tech" },
    { name: "Urban Company", industry: "Services", hrEmail: "careers@urbancompany.com", managerEmail: "talent@urbancompany.com" },
    { name: "Swiggy", industry: "Food Delivery", hrEmail: "careers@swiggy.com", managerEmail: "hr@swiggy.in" },
    { name: "Zomato", industry: "Food Delivery", hrEmail: "jobs@zomato.com", managerEmail: "talent@zomato.com" },
    { name: "Byju's", industry: "EdTech", hrEmail: "careers@byjus.com", managerEmail: "hr@byjus.com" },
    { name: "Vedantu", industry: "EdTech", hrEmail: "careers@vedantu.com", managerEmail: "hiring@vedantu.com" },
    { name: "MakeMyTrip", industry: "Travel", hrEmail: "careers@makemytrip.com", managerEmail: "hr@makemytrip.com" },
    { name: "OYO", industry: "Hospitality", hrEmail: "careers@oyorooms.com", managerEmail: "talent@oyorooms.com" },
    { name: "Nykaa", industry: "E-Commerce", hrEmail: "careers@nykaa.com", managerEmail: "hr@nykaa.com" },
    { name: "PhonePe", industry: "Fintech", hrEmail: "careers@phonepe.com", managerEmail: "design.hiring@phonepe.com" },
  ],
  marketing: [
    { name: "Dentsu India", industry: "Advertising", hrEmail: "india.careers@dentsu.com", managerEmail: "hr.india@dentsu.com" },
    { name: "McCann India", industry: "Advertising", hrEmail: "careers.india@mccann.com", managerEmail: "talent@mccann.com" },
    { name: "Ogilvy India", industry: "Advertising", hrEmail: "india.careers@ogilvy.com", managerEmail: "hr.india@ogilvy.com" },
    { name: "InMobi", industry: "AdTech", hrEmail: "careers@inmobi.com", managerEmail: "talent@inmobi.com" },
    { name: "CleverTap", industry: "MarTech", hrEmail: "jobs@clevertap.com", managerEmail: "hr@clevertap.com" },
    { name: "MoEngage", industry: "MarTech", hrEmail: "careers@moengage.com", managerEmail: "talent@moengage.com" },
    { name: "WebEngage", industry: "MarTech", hrEmail: "jobs@webengage.com", managerEmail: "hr@webengage.com" },
    { name: "Mamaearth", industry: "FMCG", hrEmail: "careers@mamaearth.in", managerEmail: "hr@mamaearth.in" },
    { name: "ShareChat", industry: "Social Media", hrEmail: "careers@sharechat.com", managerEmail: "talent@sharechat.com" },
    { name: "Josh Talks", industry: "EdTech/Media", hrEmail: "careers@joshtalks.com", managerEmail: "hr@joshtalks.com" },
  ],
  security: [
    { name: "Quick Heal Technologies", industry: "Cybersecurity", hrEmail: "careers@quickheal.com", managerEmail: "hr@quickheal.com" },
    { name: "Sequretek", industry: "Cybersecurity", hrEmail: "careers@sequretek.com", managerEmail: "talent@sequretek.com" },
    { name: "Lucideus", industry: "Cybersecurity", hrEmail: "careers@lucideus.com", managerEmail: "hr@lucideus.com" },
    { name: "Instasafe", industry: "Cybersecurity", hrEmail: "careers@instasafe.com", managerEmail: "talent@instasafe.com" },
    { name: "KPMG Cyber", industry: "Consulting", hrEmail: "kpmgindia.careers@kpmg.com", managerEmail: "cyber.hire@kpmg.com" },
    { name: "Deloitte India Cyber", industry: "Consulting", hrEmail: "in-careers@deloitte.com", managerEmail: "cyber.india@deloitte.com" },
    { name: "PwC India Cyber", industry: "Consulting", hrEmail: "careers-india@pwc.com", managerEmail: "cyber.hire@pwc.com" },
    { name: "EY India Cyber", industry: "Consulting", hrEmail: "india.careers@ey.com", managerEmail: "cyber.india@ey.com" },
    { name: "IBM Security India", industry: "Cybersecurity", hrEmail: "india.careers@ibm.com", managerEmail: "security.hire@in.ibm.com" },
    { name: "Palo Alto Networks India", industry: "Cybersecurity", hrEmail: "india.careers@paloaltonetworks.com", managerEmail: "apac.hiring@paloaltonetworks.com" },
  ],
  cloud: [
    { name: "Amazon Web Services India", industry: "Cloud", hrEmail: "india-campus@amazon.com", managerEmail: "aws.hiring@amazon.in" },
    { name: "Microsoft Azure India", industry: "Cloud", hrEmail: "india.careers@microsoft.com", managerEmail: "azure.hire@microsoft.com" },
    { name: "Google Cloud India", industry: "Cloud", hrEmail: "india-jobs@google.com", managerEmail: "cloud.hiring@google.com" },
    { name: "Netmagic", industry: "Cloud", hrEmail: "careers@netmagic.net", managerEmail: "hr@netmagic.net" },
    { name: "Sify Technologies", industry: "Cloud", hrEmail: "careers@sify.com", managerEmail: "hr@sify.com" },
    { name: "CtrlS Datacenters", industry: "Cloud", hrEmail: "careers@ctrls.in", managerEmail: "hr@ctrls.in" },
    { name: "Yotta Data Services", industry: "Cloud", hrEmail: "careers@yotta.com", managerEmail: "talent@yotta.com" },
    { name: "E2E Networks", industry: "Cloud", hrEmail: "hr@e2enetworks.com", managerEmail: "careers@e2enetworks.com" },
    { name: "Rackspace India", industry: "Cloud", hrEmail: "india.careers@rackspace.com", managerEmail: "hr.india@rackspace.com" },
    { name: "Persistent Systems", industry: "Cloud", hrEmail: "careers@persistent.com", managerEmail: "talent@persistent.com" },
  ],
};

const sizeDescriptions: Record<string, string> = {
  startup: "Startup (1–50 employees)",
  small: "Small Company (51–200 employees)",
  medium: "Mid-size Company (201–1,000 employees)",
  large: "Large Enterprise (1,000+ employees)",
};

function pickCompanies(jobRole: string, companySize: string, count: number) {
  const role = jobRole.toLowerCase();
  let pool = companiesByRole.default!;

  if (/software|developer|engineer|fullstack|frontend|backend|web/.test(role)) {
    pool = companiesByRole.software!;
  } else if (/data|analyst|scientist|machine learning|ai|ml/.test(role)) {
    pool = companiesByRole.data!;
  } else if (/design|ui|ux|graphic|creative/.test(role)) {
    pool = companiesByRole.design!;
  } else if (/market|seo|content|brand|digital/.test(role)) {
    pool = companiesByRole.marketing!;
  } else if (/security|cyber|pentest|ethical hacking/.test(role)) {
    pool = companiesByRole.security!;
  } else if (/cloud|devops|infrastructure|site reliability/.test(role)) {
    pool = companiesByRole.cloud!;
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function generateEmailBody({
  name,
  jobRole,
  skills,
  experience,
  tone,
  company,
  industry,
}: {
  name: string;
  jobRole: string;
  skills: string[];
  experience?: string;
  tone: string;
  company: string;
  industry: string;
}): { subject: string; body: string } {
  const skillLine = skills.length > 0 ? skills.slice(0, 5).join(", ") : "relevant technical skills";
  const expLine = experience?.trim()
    ? experience.trim()
    : `I have been actively building projects and developing expertise in ${skillLine}.`;

  const greetings: Record<string, string> = {
    formal: "Dear Hiring Team",
    friendly: "Hi there",
    confident: "Hello",
  };
  const closings: Record<string, string> = {
    formal: "I would welcome the opportunity to discuss how my skills could contribute to your team. Please find my resume attached.\n\nKind regards",
    friendly: "I'd love to chat about how I can add value to your team! Feel free to reach out — I'm excited about this opportunity.\n\nBest regards",
    confident: "I am confident that my skills in " + skillLine + " make me a strong fit for your team. I look forward to connecting.\n\nRegards",
  };

  const greeting = greetings[tone] ?? greetings.formal;
  const closing = closings[tone] ?? closings.formal;

  const subject = `Application for ${jobRole} Role at ${company}`;
  const body = `${greeting} at ${company},

I am writing to express my strong interest in joining ${company} as a ${jobRole}. With hands-on experience in ${skillLine}, I am eager to contribute to your team in the ${industry} space.

${expLine}

${company}'s work in the ${industry} industry is something I deeply admire, and I believe my skill set aligns well with your technical needs.

${closing},
${name}`.trim();

  return { subject, body };
}

router.post("/generate", (req, res) => {
  const body = GenerateEmailsBody.parse(req.body);
  const { name, jobRole, skills, experience, tone, companySize, count = 3 } = body;

  const companies = pickCompanies(jobRole, companySize, count);

  const emails = companies.map((company) => {
    const { subject, body: emailBody } = generateEmailBody({
      name,
      jobRole,
      skills,
      experience: experience ?? undefined,
      tone,
      company: company.name,
      industry: company.industry,
    });

    return {
      company: company.name,
      industry: company.industry,
      companySize: sizeDescriptions[companySize] ?? companySize,
      subject,
      body: emailBody,
      hrEmail: company.hrEmail,
      managerEmail: company.managerEmail,
    };
  });

  const data = GenerateEmailsResponse.parse({ emails, total: emails.length });
  res.json(data);
});

export default router;
