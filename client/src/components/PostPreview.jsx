import { motion } from 'framer-motion';

const PostPreview = ({ content, loading, tone, length }) => {
  if (loading) {
    return (
      <div className="card space-y-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-8 w-16 rounded-lg" />
          <div className="skeleton h-8 w-16 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-sm font-bold">
            in
          </div>
          <div>
            <p className="text-sm font-medium">LinkedIn Preview</p>
            <p className="text-xs text-gray-500 capitalize">
              {tone} tone · {length || 'medium'} length
            </p>
          </div>
        </div>
        <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs text-gray-400">
          Draft
        </span>
      </div>

      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
        {content}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-surface-border pt-4 text-xs text-gray-500">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>↗ Repost</span>
        <span>📤 Send</span>
      </div>
    </motion.div>
  );
};

export default PostPreview;
