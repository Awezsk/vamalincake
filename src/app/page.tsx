import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import BestSellers from "@/components/BestSellers";
import WhyUs from "@/components/WhyUs";
import OrderBanner from "@/components/OrderBanner";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="announcement-bar">
        🎂 FREE DELIVERY on orders above ₹599 &nbsp;|&nbsp; Same-day delivery across Nagpur &nbsp;|&nbsp; Call: +91 98765 43210
      </div>
      <Navbar />
      <Hero />
      <CategoryGrid />
      <BestSellers />
      <WhyUs />
      <OrderBanner />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  );
}
