import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OfficerLogin from './pages/OfficerLogin';
import OfficerRegister from './pages/OfficerRegister';


// Dashboard Components
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import RaiseComplaint from './pages/dashboard/RaiseComplaint';
import MyComplaints from './pages/dashboard/MyComplaints';
import VillageFunds from './pages/dashboard/VillageFunds';
import GovernmentSchemes from './pages/dashboard/GovernmentSchemes';
import Expenditure from './pages/dashboard/Expenditure';
import RecentPosts from './pages/dashboard/RecentPosts';
import MyRights from './pages/dashboard/MyRights';

// Governance Dashboard Components
import GovernanceLayout from './layouts/GovernanceLayout';
import Overview from './pages/governance/Overview';
import Complaints from './pages/governance/Complaints';
import Citizens from './pages/governance/Citizens';
import Funds from './pages/governance/Funds';
import Reports from './pages/governance/Reports';
import NotificationsBoard from './pages/governance/Notifications';
import Settings from './pages/governance/Settings';
import CreatePost from './pages/governance/CreatePost';
import MyPosts from './pages/governance/MyPosts';

// Placeholders for undefined pages
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center p-12 h-[60vh]">
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center max-w-sm w-full">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500">This page is currently under development.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/officer-login" element={<OfficerLogin />} />
          <Route path="/officer-register" element={<OfficerRegister />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/complaint" element={<RaiseComplaint />} />
            <Route path="/dashboard/complaints" element={<MyComplaints />} />
            <Route path="/dashboard/rights" element={<MyRights />} />
            <Route path="/dashboard/funds" element={<VillageFunds />} />
            <Route path="/dashboard/expenditure" element={<Expenditure />} />
            <Route path="/dashboard/schemes" element={<GovernmentSchemes />} />
            <Route path="/dashboard/posts" element={<RecentPosts />} />
            <Route path="/dashboard/notifications" element={<Placeholder title="Notifications" />} />
            <Route path="/dashboard/support" element={<Placeholder title="Help & Support" />} />
          </Route>

          {/* Governance Dashboard Routes (Restricted) */}
          <Route path="/governance-dashboard" element={<Overview />} /> {/* Legacy mapping */}
          <Route path="/governance" element={<GovernanceLayout />}>
             <Route path="overview" element={<Overview />} />
             <Route path="complaints" element={<Complaints />} />
             <Route path="citizens" element={<Citizens />} />
             <Route path="funds" element={<Funds />} />
             <Route path="reports" element={<Reports />} />
             <Route path="notifications" element={<NotificationsBoard />} />
             <Route path="settings" element={<Settings />} />
             <Route path="posts/new" element={<CreatePost />} />
             <Route path="posts/my" element={<MyPosts />} />
          </Route>
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
