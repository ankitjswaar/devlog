import { motion } from 'framer-motion';

const icons = {
  streak: '🔥',
  posts: '📝',
  days: '📅',
};

const StatsCard = ({ title, value, icon, loading, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card group hover:border-gray-600"
  >
    {loading ? (
      <div className="space-y-3">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-8 w-16" />
      </div>
    ) : (
      <>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-gray-400">{title}</span>
          <span className="text-xl opacity-60 transition-opacity group-hover:opacity-100">
            {icons[icon] || '📊'}
          </span>
        </div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
      </>
    )}
  </motion.div>
);

export default StatsCard;
