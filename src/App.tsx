import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Context
import { AuthProvider } from "./context/AuthProvider.tsx";
import { useAuth } from "./context/useAuth.ts";

// Pages & Components
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/EventsPage.tsx";
import EventDetailPage from "./pages/EventDetailPage.tsx";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import PostsPage from "./pages/PostsPage.tsx";
import PostDetailPage from "./pages/PostDetailPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import EditProfilePage from "./pages/EditProfilePage.tsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.tsx";
import HomeRedirect from "./pages/HomeRedirect.tsx";
import NotFound from "./pages/NotFound";
import AllCreatedEventsPage from "./pages/admin/AllCreatedEventsPage.tsx";
import AllCreatedPostsPage from "./pages/admin/AllCreatedPostsPage.tsx";
import CreateEventPage from "./pages/admin/CreateEventPage.tsx";
import CreatePostPage from "./pages/admin/CreatePostPage.tsx";
import EditEventPage from "./pages/admin/EditEventPage";
import EditPostPage from "./pages/admin/EditPostPage";
import RegistrationsPage from "./pages/admin/RegistrationsPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </BrowserRouter>
  );
}

const InnerApp: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />

        {/* Protected Routes - ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AllCreatedEventsPage />} />
          <Route path="/admin/posts" element={<AllCreatedPostsPage />} />
          <Route path="/admin/events/create" element={<CreateEventPage />} />
          <Route path="/admin/posts/create" element={<CreatePostPage />} />
          <Route path="/admin/events/edit/:id" element={<EditEventPage />} />
          <Route path="/admin/posts/edit/:id" element={<EditPostPage />} />
          <Route
            path="/admin/events/registrations/:eventId"
            element={<RegistrationsPage />}
          />
        </Route>

        {/* Protected Routes - STUDENT */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/password" element={<ChangePasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin", "student"]} />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {user?.role !== "admin" && <Footer />}
    </>
  );
};

export default App;
