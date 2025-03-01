
import { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
}

const Confetti = ({ show }: ConfettiProps) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    if (show) {
      const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-pink-500',
        'bg-purple-500',
        'bg-red-500',
        'bg-orange-500',
      ];
      
      const newParticles = Array.from({ length: 100 }).map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = `${Math.random() * 100}%`;
        const animationDelay = `${Math.random() * 2}s`;
        
        return (
          <div
            key={i}
            className={`confetti ${color}`}
            style={{
              left,
              top: '-5%',
              animationDelay,
            }}
          />
        );
      });
      
      setParticles(newParticles);
      
      // Clean up particles after animation completes
      const timer = setTimeout(() => {
        setParticles([]);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  if (!show) return null;
  
  return <div className="fixed inset-0 pointer-events-none z-50">{particles}</div>;
};

export default Confetti;
