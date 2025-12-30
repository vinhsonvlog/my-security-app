import { motion } from 'framer-motion';

const FloatingParticles = ({ count = 20 }) => {
  const particles = Array.from({ length: count });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {particles.map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            borderRadius: '50%',
            background: `rgba(6, 182, 212, ${Math.random() * 0.5 + 0.2})`,
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
