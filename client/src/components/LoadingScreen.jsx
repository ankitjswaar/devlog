import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-black">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <p className="text-sm text-gray-400">Loading DevLog AI...</p>
    </motion.div>
  </div>
);

export default LoadingScreen;
