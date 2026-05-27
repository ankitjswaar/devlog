import { motion } from 'framer-motion';

const toneColors = {
  professional: 'text-blue-400',
  sarcastic: 'text-purple-400',
  tired: 'text-amber-400',
};

const PreviousPosts = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="skeleton mb-2 h-4 w-24" />
            <div className="skeleton mb-2 h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No posts yet. Generate your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="card hover:border-gray-600"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium capitalize ${toneColors[post.tone]}`}>
                {post.tone}
              </span>
              {post.length && (
                <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-gray-400 capitalize">
                  {post.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {post.postedToLinkedIn && (
                <span className="rounded-full bg-[#0A66C2]/20 px-2 py-0.5 text-xs text-[#0A66C2]">
                  Posted
                </span>
              )}
              <span className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className="mb-2 text-xs text-gray-500 line-clamp-1">
            Notes: {post.originalLog}
          </p>
          <p className="text-sm text-gray-300 line-clamp-3">{post.generatedPost}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default PreviousPosts;
