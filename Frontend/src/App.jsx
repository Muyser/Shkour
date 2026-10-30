import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import SiteLayout from '@/components/site/SiteLayout';
// Add page imports here
import Home from '@/pages/Home';
import Universities from '@/pages/Universities';
import Institutes from '@/pages/Institutes';
import InstitutionDetail from '@/pages/InstitutionDetail';
import Countries from '@/pages/Countries';
import CountryDetail from '@/pages/CountryDetail';
import Programs from '@/pages/Programs';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Apply from '@/pages/Apply';
import Gallery from '@/pages/Gallery';
import SuccessStories from '@/pages/SuccessStories';
import FaqPage from '@/pages/FaqPage';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminApplications from '@/pages/admin/AdminApplications';
import AdminApplicationDetail from '@/pages/admin/AdminApplicationDetail';
import AdminInstitutions from '@/pages/admin/AdminInstitutions';
import AdminInstitutionEdit from '@/pages/admin/AdminInstitutionEdit';
import AdminCountries from '@/pages/admin/AdminCountries';
import AdminPrograms from '@/pages/admin/AdminPrograms';
import AdminServices from '@/pages/admin/AdminServices';
import AdminFaq from '@/pages/admin/AdminFaq';
import AdminGallery from '@/pages/admin/AdminGallery';
import AdminStories from '@/pages/admin/AdminStories';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminWhatsApp from '@/pages/admin/AdminWhatsApp';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/universities/:id" element={<InstitutionDetail />} />
        <Route path="/institutes" element={<Institutes />} />
        <Route path="/institutes/:id" element={<InstitutionDetail />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/countries/:id" element={<CountryDetail />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/apply/:institutionId" element={<Apply />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/admin" element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="applications/:id" element={<AdminApplicationDetail />} />
          <Route path="universities" element={<AdminInstitutions type="university" />} />
          <Route path="universities/new" element={<AdminInstitutionEdit />} />
          <Route path="universities/:id" element={<AdminInstitutionEdit />} />
          <Route path="institutes" element={<AdminInstitutions type="institute" />} />
          <Route path="institutes/new" element={<AdminInstitutionEdit />} />
          <Route path="institutes/:id" element={<AdminInstitutionEdit />} />
          <Route path="countries" element={<AdminCountries />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="faq" element={<AdminFaq />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="stories" element={<AdminStories />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="whatsapp" element={<AdminWhatsApp />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App