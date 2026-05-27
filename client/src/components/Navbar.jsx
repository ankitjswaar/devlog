import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ transparent = false }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 z-50 w-full ${
        transparent
          ? 'bg-transparent'
          : 'border-b border-surface-border bg-black/80 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold">
            DL
          </div>
          <span className="text-lg font-semibold">DevLog AI</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <span className="hidden text-sm text-gray-500 sm:inline">
                {user?.name}
              </span>
              <button onClick={handleLogout} className="btn-secondary py-2 text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary py-2 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
