import { motion } from 'framer-motion';

const tones = [
  {
    id: 'professional',
    label: 'Professional',
    description: 'Polished & credible',
    emoji: '💼',
  },
  {
    id: 'sarcastic',
    label: 'Sarcastic',
    description: 'Witty senior dev energy',
    emoji: '😏',
  },
  {
    id: 'tired',
    label: 'Tired Developer',
    description: 'Honest 11pm vibes',
    emoji: '😴',
  },
];

const ToneSelector = ({ selected, onSelect, disabled }) => (
  <div className="grid gap-3 sm:grid-cols-3">
    {tones.map((tone) => (
      <motion.button
        key={tone.id}
        type="button"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => !disabled && onSelect(tone.id)}
        disabled={disabled}
        className={`rounded-xl border p-4 text-left transition-all duration-200 ${
          selected === tone.id
            ? 'border-accent bg-accent/10 ring-1 ring-accent'
            : 'border-surface-border bg-surface-elevated hover:border-gray-500'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <span className="mb-2 block text-2xl">{tone.emoji}</span>
        <span className="block font-medium">{tone.label}</span>
        <span className="mt-1 block text-xs text-gray-500">{tone.description}</span>
      </motion.button>
    ))}
  </div>
);

export default ToneSelector;
