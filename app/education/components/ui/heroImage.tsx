"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Button } from "../ui/button";

const slides = [
  {
    id: 1,
    image: "/HeroImage.webp",
    title: "Guiding Students",
    highlight: "to Success",
    description: "Choose, Budget and thrive!",
    buttonText: "Apply Now",
    buttonLink: "/apply"
  },
  {
    id: 2,
    image: "/HeroImg2.webp",
    title: "Unlocking",
    highlight: "Global\nOpportunities",
    description: "For your Academic Journey!",
    buttonText: "Apply Now",
    buttonLink: "/apply"
  }
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[77vh] overflow-hidden flex items-center bg-gray-900">
      
      {/* BACKGROUND IMAGE LAYER – object-position lower so more of the bottom is visible (elevated in container) */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={slides[currentIndex].id}
          src={slides[currentIndex].image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className={`absolute inset-0 w-full h-full object-cover z-0 ${
            currentIndex === 0
              ? "object-[80%_top] md:object-[center_top]"
              : "object-[70%_top] md:object-[center_top]"
          }`}
          alt="Hero Background"
        />
      </AnimatePresence>
      
      {/* CONTENT GRID - mobile: text lower, full width, transparent bg; desktop: full layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full grid grid-cols-1 md:grid-cols-2 items-end md:items-center relative z-10 pt-75 pb-6 md:pt-6 md:pb-0 min-h-0">
        
        {/* LEFT COLUMN: mobile = full width + lower; desktop = full */}
        <div className="flex flex-col items-center md:items-start justify-end md:justify-center -mt-0 md:-mt-32 w-full md:max-w-none col-span-1 md:pt-12">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left w-full min-w-0 rounded-xl px-5 py-4 md:px-0 md:py-0 bg-black/25 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none"
            >
              {/* Main heading - reference style: large display size on mobile, bold white */}
              <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold leading-tight text-white mb-4 md:mb-10">
                {slides[currentIndex].title}
                <br />
                {slides[currentIndex].highlight.includes("\n") ? (
                  slides[currentIndex].highlight.split("\n").map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))
                ) : (
                  slides[currentIndex].highlight
                )}
              </h1>
              
              {/* Sub-headline - center on mobile, left on desktop */}
              <p className="text-2xl md:text-3xl font-medium text-white max-w-lg mb-6 md:mb-12 leading-snug mx-auto md:mx-0">
                {slides[currentIndex].description}
              </p>

              {/* CTA - centered on mobile */}
              <div className="flex justify-center md:justify-start">
              <Link to={slides[currentIndex].buttonLink}>
                <Button 
                  size="lg" 
                  className="bg-[#FF4D6D] hover:bg-[#E11D48] text-white font-bold text-lg px-8 py-5 md:px-12 md:py-6 rounded-xl md:rounded-2xl shadow-lg transition-all hover:opacity-95"
                >
                  {slides[currentIndex].buttonText}
                </Button>
              </Link>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN */}
        <div></div>

      </div>
    </div>
  );
}
