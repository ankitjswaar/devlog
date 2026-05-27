const toneInstructions = {
  professional:
    'Write in a confident, professional tone. Sound like a senior developer sharing genuine insights. Be warm but polished.',
  sarcastic:
    'Write in a sarcastic professional tone — witty, self-aware, slightly dry humor, but still credible and not cringe. Think senior dev who has seen too many standups.',
  tired:
    'Write in a tired developer tone — honest, slightly exhausted, relatable, understated humor. Like someone logging off at 11pm after fixing one bug.',
};

export const buildGenerationPrompt = (notes, tone) => {
  const toneKey = tone.toLowerCase();
  const instruction = toneInstructions[toneKey] || toneInstructions.professional;

  return `You are a skilled developer who writes engaging LinkedIn posts.

Convert these rough developer learning notes into a polished LinkedIn post.

ROUGH NOTES:
"${notes}"

TONE: ${tone}
${instruction}

RULES:
- Sound human and authentic — never robotic or corporate-buzzword heavy
- Avoid cringe, clichés like "I'm humbled" or "excited to announce"
- Keep it readable: short paragraphs, natural flow
- Length: 150-280 words (LinkedIn-friendly)
- Include 3-5 relevant hashtags at the end on their own line
- Do NOT use markdown formatting
- Do NOT wrap in quotes
- Return ONLY the post text, nothing else`;
};
