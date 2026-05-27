import { motion } from 'framer-motion';

const lengths = [
  {
    id: 'short',
    label: 'Short',
    description: '~80 words · quick update',
    emoji: '⚡',
  },
  {
    id: 'medium',
    label: 'Medium',
    description: '~180 words · balanced',
    emoji: '📝',
  },
  {
    id: 'long',
    label: 'Long',
    description: '~350 words · detailed story',
    emoji: '📖',
  },
];

const LengthSelector = ({ selected, onSelect, disabled }) => (
  <div className="grid gap-3 sm:grid-cols-3">
    {lengths.map((item) => (
      <motion.button
        key={item.id}
        type="button"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => !disabled && onSelect(item.id)}
        disabled={disabled}
        className={`rounded-xl border p-4 text-left transition-all duration-200 ${
          selected === item.id
            ? 'border-accent bg-accent/10 ring-1 ring-accent'
            : 'border-surface-border bg-surface-elevated hover:border-gray-500'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <span className="mb-2 block text-2xl">{item.emoji}</span>
        <span className="block font-medium">{item.label}</span>
        <span className="mt-1 block text-xs text-gray-500">{item.description}</span>
      </motion.button>
    ))}
  </div>
);

export default LengthSelector;
