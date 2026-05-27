import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const steps = [
  { step: '01', title: 'Dump your notes', desc: 'Write messy bullet points about what you learned or built today.' },
  { step: '02', title: 'Pick your tone', desc: 'Professional, sarcastic, or tired developer — we match your vibe.' },
  { step: '03', title: 'Generate & post', desc: 'AI polishes your notes into a LinkedIn post and publishes it for you.' },
];

const features = [
  { icon: '⚡', title: 'AI-Powered', desc: 'GPT transforms rough notes into engaging posts in seconds.' },
  { icon: '🔗', title: 'LinkedIn Native', desc: 'OAuth integration posts directly to your profile.' },
  { icon: '🎯', title: 'Tone Control', desc: 'Three distinct voices so you never sound like a bot.' },
  { icon: '📊', title: 'Track Progress', desc: 'Streaks, stats, and post history keep you consistent.' },
];

const toneExamples = [
  {
    tone: 'Professional',
    input: 'learned react hooks built dashboard',
    output: 'Spent today deep in React hooks — useState, useEffect, and custom hooks finally clicked. Built a real-time dashboard that actually renders without crying. Small wins compound.',
  },
  {
    tone: 'Sarcastic',
    input: 'debugged css for 3 hours',
    output: 'Three hours debugging CSS. The bug was a missing semicolon. My therapist will hear about this. At least the layout doesn\'t look like it was designed in 2003 anymore.',
  },
  {
    tone: 'Tired',
    input: 'fixed one bug introduced two',
    output: 'Fixed one bug. Introduced two. It\'s 11pm. The code works. I don\'t. Shipping anyway because tomorrow-me can deal with it.',
  },
];

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black">
      <Navbar transparent />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-black to-black" />
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <span className="mb-6 inline-block rounded-full border border-surface-border bg-surface-card px-4 py-1.5 text-sm text-gray-400">
              AI-powered developer journaling
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-7xl"
          >
            Build In Public
            <br />
            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Without Thinking Too Hard
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-gray-400"
          >
            Turn messy developer notes into polished LinkedIn posts using AI.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="btn-primary text-base"
            >
              Start Writing
            </Link>
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="btn-linkedin text-base"
            >
              <LinkedInIcon />
              Connect LinkedIn
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-surface-border px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-3xl font-bold"
          >
            How It Works
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card text-center"
              >
                <span className="mb-4 block font-mono text-4xl font-bold text-accent/50">
                  {item.step}
                </span>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-surface-border bg-surface/50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-3xl font-bold"
          >
            Features
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card hover:border-gray-600"
              >
                <span className="mb-4 block text-3xl">{f.icon}</span>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tone Examples */}
      <section className="border-t border-surface-border px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-3xl font-bold"
          >
            Tone Examples
          </motion.h2>
          <p className="mb-16 text-center text-gray-400">
            Same messy notes. Completely different vibes.
          </p>
          <div className="grid gap-6 lg:grid-cols-3">
            {toneExamples.map((ex, i) => (
              <motion.div
                key={ex.tone}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card"
              >
                <span className="mb-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
                  {ex.tone}
                </span>
                <p className="mb-3 font-mono text-xs text-gray-500">
                  Input: &quot;{ex.input}&quot;
                </p>
                <p className="text-sm leading-relaxed text-gray-300">{ex.output}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-surface-border px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to ship your devlog?</h2>
          <p className="mb-8 text-gray-400">
            Stop overthinking LinkedIn posts. Start building in public.
          </p>
          <Link to="/register" className="btn-primary">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-accent font-mono text-xs font-bold">
              DL
            </div>
            <span className="text-sm text-gray-400">DevLog AI © 2026</span>
          </div>
          <p className="text-sm text-gray-500">Built for developers who ship.</p>
        </div>
      </footer>
    </div>
  );
};

const LinkedInIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default Landing;
