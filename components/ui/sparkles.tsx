"use client";
import React, { useId, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particlesNumber?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particlesNumber,
  } = props;
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      // particles loaded
    }
  };

  const generatedId = useId();
  return (
    <AnimatePresence>
      {init && (
        <motion.div animate={{ opacity: 1 }} className={cn("opacity-0", className)}>
          <Particles
            id={id || generatedId}
            className={cn("h-full w-full")}
            particlesLoaded={particlesLoaded}
            options={{
              background: { color: { value: background || "#0d47a1" } },
              fullScreen: { enable: false, zIndex: 1 },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: { enable: true, mode: "push" },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                    parallax: { enable: true, force: 60, smooth: 10 },
                  },
                },
                modes: {
                  push: { quantity: 4 },
                  repulse: { distance: 120, duration: 0.4 },
                },
              },
              particles: {
                bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
                collisions: { enable: false },
                color: { value: particleColor || "#ffffff" },
                links: {
                  color: particleColor || "#ffffff",
                  distance: 160,
                  enable: true,
                  opacity: 0.25,
                  width: 1,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: { default: "out" },
                  random: true,
                  speed: speed ?? 0.6,
                  straight: false,
                  attract: { enable: false },
                },
                number: { density: { enable: true, width: 400 }, value: particlesNumber ?? 80 },
                opacity: {
                  value: { min: 0.1, max: 0.5 },
                  animation: { enable: true, speed: 0.8, sync: false },
                },
                shape: { type: "circle" },
                size: {
                  value: { min: minSize ?? 1, max: maxSize ?? 3 },
                },
              },
              detectRetina: true,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
