"use client";
import React, { useRef, useEffect, useState } from 'react';
import {
  motion
} from "framer-motion";
interface Project {
  title: string;
  link: string;
  thumbnail: string;
}

interface EnhancedHeroParallaxProps {
  projects?: Project[];
}

const EnhancedHeroParallax: React.FC<EnhancedHeroParallaxProps> = ({ projects = [] }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        setScrollY(progress);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Safely slice projects array with fallbacks
  const safeProjects = projects || [];
  const firstRow = safeProjects.slice(0, 5);
  const secondRow = safeProjects.slice(5, 10);
  const thirdRow = safeProjects.slice(10, 15);

  // Don't render project rows if no projects are provided
  const hasProjects = safeProjects.length > 0;

  // Gradient orbs
  const GradientOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        style={{
          top: '10%',
          left: '10%',
          transform: `translate(${mousePos.x * 50 + scrollY * 200}px, ${mousePos.y * 30}px)`,
          transition: 'transform 0.6s ease-out'
        }}
      />
      <div 
        className="absolute w-64 h-64 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-2xl"
        style={{
          top: '60%',
          right: '10%',
          transform: `translate(${-mousePos.x * 40 - scrollY * 150}px, ${-mousePos.y * 20}px)`,
          transition: 'transform 0.7s ease-out'
        }}
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="min-h-[400vh] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}
    >
      <GradientOrbs />
      
      {/* Hero Header */}
      <div className="sticky top-0 h-screen flex items-center justify-center relative z-10">
        <div 
          className="text-center relative z-20"
          style={{
            transform: `translateY(${scrollY * 100}px) rotateX(${scrollY * 15}deg)`,
            opacity: 1 - scrollY * 0.8
          }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-8">
            VISIONARY
            <br />
            <span className="text-5xl md:text-7xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CREATIONS
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Crafted solutions that define innovation
          </p>
          
          {/* Animated rings around text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute border border-purple-400/20 rounded-full"
                style={{
                  width: `${300 + i * 100}px`,
                  height: `${300 + i * 100}px`,
                  transform: `rotate(${scrollY * 360 * (i + 1) * 0.1}deg)`,
                  opacity: 0.3 - i * 0.1
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Parallax Cards Container */}
      {hasProjects && (
        <div 
          className="relative"
          style={{
            transform: `rotateX(${15 - scrollY * 15}deg) rotateZ(${scrollY * 5}deg) translateY(${-scrollY * 200}px)`,
            transformOrigin: 'center top'
          }}
        >
          {/* First Row - Moving Right */}
          {firstRow.length > 0 && (
            <div 
              className="flex gap-8 mb-16 justify-center"
              style={{
                transform: `translateX(${scrollY * 600 - 300}px)`,
              }}
            >
              {firstRow.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} scrollY={scrollY} />
              ))}
            </div>
          )}

          {/* Second Row - Moving Left */}
          {secondRow.length > 0 && (
            <div 
              className="flex gap-8 mb-16 justify-center"
              style={{
                transform: `translateX(${-scrollY * 800 + 400}px)`,
              }}
            >
              {secondRow.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index + 5} scrollY={scrollY} />
              ))}
            </div>
          )}

          {/* Third Row - Moving Right */}
          {thirdRow.length > 0 && (
            <div 
              className="flex gap-8 mb-16 justify-center"
              style={{
                transform: `translateX(${scrollY * 500 - 250}px)`,
              }}
            >
              {thirdRow.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index + 10} scrollY={scrollY} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom CTA Section */}
      <div 
        className="h-screen flex items-center justify-center relative"
        style={{
          transform: `translateY(${-scrollY * 300}px)`,
          opacity: Math.max(0, scrollY - 0.3) * 2
        }}
      >
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to Create Magic?
          </h2>
          <button className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-semibold rounded-full hover:scale-110 transition-transform duration-300 shadow-2xl">
            Let's Build Together
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
  scrollY: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, scrollY }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group cursor-pointer flex-shrink-0"
      style={{
        width: '350px',
        height: '400px',
        transform: `translateY(${Math.sin(scrollY * 5 + index) * 15}px) rotateY(${scrollY * 15}deg)`,
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ scale: 1.05, y: -20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Background with Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Project Image */}
        <div className="relative h-full overflow-hidden">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop&auto=format`;
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Project title overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
              {project.title}
            </h3>
            
            {/* Interactive elements that appear on hover */}
            <div className={`transform transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-400 font-medium hover:text-purple-300 transition-colors"
              >
                Visit Project →
              </a>
            </div>
          </div>
        </div>

        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default EnhancedHeroParallax;