import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import ToneSelector from '../components/ToneSelector';
import LengthSelector from '../components/LengthSelector';
import PostPreview from '../components/PostPreview';
import PreviousPosts from '../components/PreviousPosts';
import { postsAPI, linkedinAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { linkedinConnected } = useAuth();
  const [notes, setNotes] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generatedPost, setGeneratedPost] = useState('');
  const [currentPostId, setCurrentPostId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [stats, setStats] = useState({ currentStreak: 0, totalPosts: 0, learningDays: 0 });
  const [posts, setPosts] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await postsAPI.getStats();
      setStats(data.stats);
    } catch {
      toast.error('Failed to load stats');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await postsAPI.getAll();
      setPosts(data.posts);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchPosts();
  }, [fetchStats, fetchPosts]);

  const handleGenerate = async () => {
    if (!notes.trim()) {
      toast.error('Write something about what you learned today');
      return;
    }

    setGenerating(true);
    setGeneratedPost('');

    try {
      const { data } = await postsAPI.generate({ notes, tone, length });
      setGeneratedPost(data.post.generatedPost);
      setCurrentPostId(data.post.id);
      setStats((prev) => ({
        ...prev,
        currentStreak: data.stats.currentStreak,
        learningDays: data.stats.learningDays,
        totalPosts: prev.totalPosts + 1,
      }));
      fetchPosts();
      toast.success('Post generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate post');
    } finally {
      setGenerating(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    setConnecting(true);
    try {
      const { data } = await linkedinAPI.getAuthUrl();
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start LinkedIn connection');
      setConnecting(false);
    }
  };

  const handlePostToLinkedIn = async () => {
    if (!generatedPost) {
      toast.error('Generate a post first');
      return;
    }

    if (!linkedinConnected) {
      toast.error('Connect your LinkedIn account first');
      return;
    }

    setPosting(true);
    try {
      await linkedinAPI.post({
        postId: currentPostId,
        content: generatedPost,
      });
      toast.success('Posted to LinkedIn!');
      fetchPosts();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post to LinkedIn');
    } finally {
      setPosting(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-gray-400">What did you ship today?</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon="streak"
            loading={statsLoading}
            delay={0}
          />
          <StatsCard
            title="Total Posts"
            value={stats.totalPosts}
            icon="posts"
            loading={statsLoading}
            delay={0.1}
          />
          <StatsCard
            title="Learning Days"
            value={stats.learningDays}
            icon="days"
            loading={statsLoading}
            delay={0.2}
          />
        </div>

        {/* LinkedIn Status */}
        {!linkedinConnected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card flex flex-col items-start justify-between gap-4 border-[#0A66C2]/30 bg-[#0A66C2]/5 sm:flex-row sm:items-center"
          >
            <div>
              <p className="font-medium">LinkedIn not connected</p>
              <p className="text-sm text-gray-400">
                Connect your account to post directly from DevLog AI
              </p>
            </div>
            <button
              onClick={handleConnectLinkedIn}
              disabled={connecting}
              className="btn-linkedin shrink-0"
            >
              {connecting ? 'Redirecting...' : 'Connect LinkedIn'}
            </button>
          </motion.div>
        )}

        {linkedinConnected && (
          <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2 text-sm text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            LinkedIn connected
          </div>
        )}

        {/* Daily Input */}
        <div className="card space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Daily Learning Log
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you learn today?"
            rows={5}
            disabled={generating}
            className="input-field resize-none font-mono text-sm"
          />

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-300">
              Select Tone
            </label>
            <ToneSelector
              selected={tone}
              onSelect={setTone}
              disabled={generating}
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-300">
              Post Length
            </label>
            <LengthSelector
              selected={length}
              onSelect={setLength}
              disabled={generating}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !notes.trim()}
            className="btn-primary w-full sm:w-auto"
          >
            {generating ? (
              <>
                <Spinner />
                Generating...
              </>
            ) : (
              'Generate Post'
            )}
          </button>
        </div>

        {/* Preview */}
        {(generatedPost || generating) && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Generated Preview</h2>
            <PostPreview
              content={generatedPost}
              loading={generating}
              tone={tone}
              length={length}
            />

            {generatedPost && (
              <button
                onClick={handlePostToLinkedIn}
                disabled={posting || !linkedinConnected}
                className="btn-linkedin w-full sm:w-auto"
                title={!linkedinConnected ? 'Connect LinkedIn first' : ''}
              >
                {posting ? (
                  <>
                    <Spinner />
                    Posting...
                  </>
                ) : (
                  <>
                    <LinkedInIcon />
                    Post To LinkedIn
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Previous Posts */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Previous Posts</h2>
          <PreviousPosts posts={posts} loading={postsLoading} />
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default Dashboard;
