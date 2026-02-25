import Header from "@/components/Header";
import HomeHero from "@/components/HomeHero";
import TwoPathsSection from "@/components/TwoPathsSection";
import PhilosophySection from "@/components/PhilosophySection";
import UpcomingEvents from "@/components/UpcomingEvents";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HomeHero />
        <TwoPathsSection />
        <PhilosophySection />
        <UpcomingEvents />
      </main>
      <Footer />
    </div>
  );
};

export default Index;