import Navbar from '../components/Navbar';

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-black">
    <Navbar />
    <main className="mx-auto max-w-4xl px-6 pb-16 pt-24">{children}</main>
  </div>
);

export default DashboardLayout;
