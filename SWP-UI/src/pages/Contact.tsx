import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ContactSection } from "@/components/ContactSection";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      <ContactSection />
      <Footer />
    </div>
  );
}