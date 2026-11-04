import Navbar from "@/components/Navbar";
import AssessmentForm from "@/components/AssessmentForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col justify-start py-4 sm:py-8">
        <AssessmentForm />
      </main>
      <Footer />
    </div>
  );
}