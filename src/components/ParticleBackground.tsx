/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
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
