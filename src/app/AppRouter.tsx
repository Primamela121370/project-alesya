import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { ToastProvider } from '../components/common/ToastProvider';
import { ProtectedRoute } from '../features/admin/auth/ProtectedRoute';
import { AuthProvider } from '../features/admin/auth/AuthContext';
import { PublicLandingPage } from '../features/public/PublicLandingPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { ContactsAdminPage } from '../pages/admin/ContactsAdminPage';
import { FaqAdminPage } from '../pages/admin/FaqAdminPage';
import { HeroAdminPage } from '../pages/admin/HeroAdminPage';
import { LeadsAdminPage } from '../pages/admin/LeadsAdminPage';
import { ResultsAdminPage } from '../pages/admin/ResultsAdminPage';
import { SectionsAdminPage } from '../pages/admin/SectionsAdminPage';
import { SeoAdminPage } from '../pages/admin/SeoAdminPage';
import { TestimonialsAdminPage } from '../pages/admin/TestimonialsAdminPage';

export function AppRouter() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLandingPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="hero" element={<HeroAdminPage />} />
                <Route path="sections" element={<SectionsAdminPage />} />
                <Route path="results" element={<ResultsAdminPage />} />
                <Route path="testimonials" element={<TestimonialsAdminPage />} />
                <Route path="faq" element={<FaqAdminPage />} />
                <Route path="contacts" element={<ContactsAdminPage />} />
                <Route path="seo" element={<SeoAdminPage />} />
                <Route path="leads" element={<LeadsAdminPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
