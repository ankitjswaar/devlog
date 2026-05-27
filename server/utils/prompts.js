const toneInstructions = {
  professional:
    'Write in a confident, professional tone. Sound like a senior developer sharing genuine insights. Be warm but polished.',
  sarcastic:
    'Write in a sarcastic professional tone — witty, self-aware, slightly dry humor, but still credible and not cringe. Think senior dev who has seen too many standups.',
  tired:
    'Write in a tired developer tone — honest, slightly exhausted, relatable, understated humor. Like someone logging off at 11pm after fixing one bug.',
};

const lengthInstructions = {
  short:
    'LENGTH: Short post — strictly 60-100 words. Punchy, one key takeaway, minimal fluff. Perfect for a quick daily update.',
  medium:
    'LENGTH: Medium post — 150-220 words. Balanced depth, 2-3 short paragraphs, LinkedIn sweet spot.',
  long:
    'LENGTH: Long post — 280-400 words. Tell a mini story with context, what you tried, what you learned, and a takeaway. Still scannable.',
};

export const buildGenerationPrompt = (notes, tone, length = 'medium') => {
  const toneKey = tone.toLowerCase();
  const lengthKey = length.toLowerCase();
  const instruction = toneInstructions[toneKey] || toneInstructions.professional;
  const lengthRule = lengthInstructions[lengthKey] || lengthInstructions.medium;

  return `You are a skilled developer who writes engaging LinkedIn posts.

Convert these rough developer learning notes into a polished LinkedIn post.

ROUGH NOTES:
"${notes}"

TONE: ${tone}
${instruction}

${lengthRule}

RULES:
- Sound human and authentic — never robotic or corporate-buzzword heavy
- Avoid cringe, clichés like "I'm humbled" or "excited to announce"
- Keep it readable: short paragraphs, natural flow
- Respect the word count target above — do not exceed it by more than 15%
- Include 3-5 relevant hashtags at the end on their own line
- Do NOT use markdown formatting
- Do NOT wrap in quotes
- Return ONLY the post text, nothing else`;
};
