import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ResearchOverview from "@/components/ResearchOverview";
import AssessmentForm from "@/components/AssessmentForm";
import Methodology from "@/components/Methodology";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ResearchOverview />
        <AssessmentForm />
        <Methodology />
        <About />
      </main>
      <Footer />
    </div>
  );
}
