/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { particlesOptions } from "../config/particlesConfig";

interface ParticleBackgroundProps {
  /**
   * Function to initialize the particles engine
   */
  particlesInit: (engine: Engine) => Promise<void>;
  /**
   * Optional additional class names for the container
   */
  className?: string;
  /**
   * Optional ID for the particles instance
   */
  id?: string;
}

/**
 * A component that renders an interactive particle background
 */
const ParticleBackground = ({ 
  particlesInit, 
  className = "absolute inset-0 -z-10 pointer-events-none",
  id = "tsparticles" 
}: ParticleBackgroundProps) => {
  return (
    <div className={className}>
      <Particles 
        id={id} 
        init={particlesInit} 
        options={particlesOptions} 
      />
    </div>
  );
};

export default ParticleBackground;
