import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loadUser, updateLinkedInStatus } = useAuth();

  const error = searchParams.get('error');
  const token = searchParams.get('token');
  const connected = searchParams.get('connected');

  useEffect(() => {
    const handleCallback = async () => {
      if (error) {
        toast.error(decodeURIComponent(error));
        return;
      }

      if (token && connected) {
        localStorage.setItem('token', token);
        await loadUser();
        updateLinkedInStatus(true);
        toast.success('LinkedIn connected successfully!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    };

    handleCallback();
  }, [error, token, connected, loadUser, updateLinkedInStatus, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-md text-center"
        >
          <div className="mb-4 text-4xl">⚠️</div>
          <h1 className="mb-2 text-xl font-bold">Connection Failed</h1>
          <p className="mb-6 text-sm text-gray-400">{decodeURIComponent(error)}</p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  if (token && connected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-md text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-3xl">
              ✓
            </div>
          </div>
          <h1 className="mb-2 text-xl font-bold">LinkedIn Connected!</h1>
          <p className="text-sm text-gray-400">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return <LoadingScreen />;
};

export default LinkedInCallback;
