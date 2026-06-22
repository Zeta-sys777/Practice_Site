import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export function Layout({ children, variant = "dark" }: { children: React.ReactNode, variant?: "light" | "dark" }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header variant={variant} />
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
