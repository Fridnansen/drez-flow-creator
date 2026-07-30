import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Story from "@/components/landing/Story";
import Team from "@/components/landing/Team";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <Hero />
      <Features />
      <Story />
      <Team />
    </main>
    <Footer />
  </div>
);

export default Index;
