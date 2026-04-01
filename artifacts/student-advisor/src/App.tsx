import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Home from "./pages/Home";
import CareerAssessment from "./pages/CareerAssessment";
import Roadmap from "./pages/Roadmap";
import SkillIntelligence from "./pages/SkillIntelligence";
import ScholarshipFinder from "./pages/ScholarshipFinder";
import EmailGenerator from "./pages/EmailGenerator";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/career" component={CareerAssessment} />
        <Route path="/career/roadmap/:career" component={Roadmap} />
        <Route path="/skills" component={SkillIntelligence} />
        <Route path="/scholarships" component={ScholarshipFinder} />
        <Route path="/email" component={EmailGenerator} />
        <Route path="/chatbot" component={Chatbot} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
