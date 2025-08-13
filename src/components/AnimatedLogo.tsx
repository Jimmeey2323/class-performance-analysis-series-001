
import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const AnimatedLogo = () => {
  return (
    <motion.div
      className="relative flex items-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-lg blur-lg"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Logo icon with complex animation */}
      <motion.div
        className="relative z-10"
        animate={{
          rotateY: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotateY: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <motion.div
          className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary"
          whileHover={{
            rotate: [0, -10, 10, -10, 0],
            scale: 1.1,
          }}
          transition={{
            rotate: {
              duration: 0.5,
              ease: "easeInOut"
            }
          }}
        >
          <Activity className="h-6 w-6 text-white" />
        </motion.div>
      </motion.div>
      
      {/* Text with typewriter effect */}
      <motion.div
        className="relative z-10"
        initial={{ width: 0 }}
        animate={{ width: "auto" }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.span
          className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Analytics
        </motion.span>
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>
  );
};

export default AnimatedLogo;
