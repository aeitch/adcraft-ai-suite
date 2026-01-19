import { motion } from "framer-motion";

export const CircuitDecorations = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {/* Top right circuit */}
      <svg
        className="absolute top-0 right-0 w-96 h-64 opacity-20"
        viewBox="0 0 400 250"
        fill="none"
      >
        <motion.path
          d="M300 0 L300 50 L350 50 L350 100 L400 100"
          stroke="url(#gradient1)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M250 0 L250 80 L300 80 L300 150 L350 150"
          stroke="url(#gradient1)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.path
          d="M350 0 L350 30 L380 30 L380 60 L400 60"
          stroke="url(#gradient1)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        />
        {/* Circuit nodes */}
        <motion.circle
          cx="300"
          cy="50"
          r="3"
          fill="#A855F7"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        />
        <motion.circle
          cx="350"
          cy="100"
          r="3"
          fill="#22D3EE"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        />
        <motion.circle
          cx="300"
          cy="150"
          r="3"
          fill="#A855F7"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      </svg>

      {/* Bottom left circuit */}
      <svg
        className="absolute bottom-0 left-64 w-80 h-48 opacity-15"
        viewBox="0 0 320 200"
        fill="none"
      >
        <motion.path
          d="M0 150 L50 150 L50 100 L100 100 L100 50 L150 50"
          stroke="url(#gradient2)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.path
          d="M0 180 L80 180 L80 120 L150 120 L150 80 L200 80"
          stroke="url(#gradient2)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
        />
        <motion.circle
          cx="100"
          cy="100"
          r="3"
          fill="#22D3EE"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8 }}
        />
        <motion.circle
          cx="150"
          cy="50"
          r="3"
          fill="#A855F7"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
        />
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating nodes with glow */}
      {[
        { x: "70%", y: "15%", delay: 0 },
        { x: "80%", y: "25%", delay: 0.5 },
        { x: "85%", y: "10%", delay: 1 },
        { x: "75%", y: "35%", delay: 1.5 },
      ].map((node, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: node.x,
            top: node.y,
            background: i % 2 === 0 ? "#A855F7" : "#22D3EE",
            boxShadow: `0 0 10px ${i % 2 === 0 ? "#A855F7" : "#22D3EE"}`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: node.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
