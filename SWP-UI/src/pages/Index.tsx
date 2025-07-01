import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { AboutSection } from "@/components/AboutSection";
import { BlogSection } from "@/components/BlogSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      
      {/* Hero section - no animation for above-fold content */}
      <Hero />
      
      {/* Services section with fade in animation */}
      <ScrollReveal animation="fadeInUp" delay={100}>
        <ServicesSection />
      </ScrollReveal>
      
      {/* Process section with slide from left */}
      <ScrollReveal animation="fadeInLeft" delay={200}>
        <ProcessSection />
      </ScrollReveal>
      
      {/* About section with slide from right */}
      <ScrollReveal animation="fadeInRight" delay={100}>
        <AboutSection />
      </ScrollReveal>
      
      {/* Blog section with scale in animation */}
      <ScrollReveal animation="scaleIn" delay={150}>
        <BlogSection />
      </ScrollReveal>
      
      {/* Contact section with fade in */}
      <ScrollReveal animation="fadeIn" delay={100}>
        <ContactSection />
      </ScrollReveal>
      
      <Footer />
    </div>
  );
}
