import Navbar from "@/components/Navbar";
import ChatAssessment from "@/components/ChatAssessment";

export default function Home() {
  return (
    <div className="h-[100dvh] flex flex-col bg-background text-foreground overflow-hidden">
      <Navbar />
      <main className="flex-1 min-h-0">
        <ChatAssessment />
      </main>
    </div>
  );
}