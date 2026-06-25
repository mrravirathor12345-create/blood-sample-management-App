import React, { useCallback } from 'react';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';
import './ParticleBackground.css';

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="particle-background"
      className="particle-background"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
          number: { value: 70, density: { enable: true, area: 1100 } },
          color: { value: ['#ff4b76', '#ff1d4c', '#c5173c'] },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.1, max: 0.5 } },
          size: { value: { min: 2, max: 6 } },
          move: { enable: true, speed: 0.9, direction: 'none', outModes: { default: 'out' } },
          links: { enable: true, distance: 140, color: '#ff3c6a', opacity: 0.15, width: 1 },
        },
        interactivity: {
          detectsOn: 'canvas',
          events: {
            onHover: { enable: true, mode: 'bubble' },
            onClick: { enable: true, mode: 'push' },
            resize: true,
          },
          modes: {
            bubble: { distance: 140, size: 8, duration: 2, opacity: 0.8 },
            push: { quantity: 2 },
          },
        },
      }}
    />
  );
};

export default ParticleBackground;
