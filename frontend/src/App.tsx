import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { useAuth } from "@/auth/AuthContext";
import { DiscoverBusinessesPage } from "@/pages/DiscoverBusinessesPage";
import { BusinessDetailPage } from "@/pages/BusinessDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { CreatorApplicationsPage } from "@/pages/creator/CreatorApplicationsPage";
import { CreatorContentPage } from "@/pages/creator/CreatorContentPage";
import { CreatorProfilePage } from "@/pages/creator/CreatorProfilePage";
import { BusinessApplicationsInboxPage } from "@/pages/business/BusinessApplicationsInboxPage";
import { BusinessContentReviewPage } from "@/pages/business/BusinessContentReviewPage";
import { BusinessProfilePage } from "@/pages/business/BusinessProfilePage";
import { BusinessLeaderboardPage } from "@/pages/business/BusinessLeaderboardPage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";

export default function App() {
  const { isReady } = useAuth();

  if (!isReady) return null;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <AppShell>
            <DiscoverBusinessesPage />
          </AppShell>
        }
      />
      <Route
        path="/businesses/:id"
        element={
          <AppShell>
            <BusinessDetailPage />
          </AppShell>
        }
      />

      <Route
        path="/creator/applications"
        element={
          <ProtectedRoute allowedRoles={["CREATOR"]}>
            <AppShell>
              <CreatorApplicationsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/content"
        element={
          <ProtectedRoute allowedRoles={["CREATOR"]}>
            <AppShell>
              <CreatorContentPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/profile"
        element={
          <ProtectedRoute allowedRoles={["CREATOR"]}>
            <AppShell>
              <CreatorProfilePage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/business/applications"
        element={
          <ProtectedRoute allowedRoles={["BUSINESS"]}>
            <AppShell>
              <BusinessApplicationsInboxPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/content"
        element={
          <ProtectedRoute allowedRoles={["BUSINESS"]}>
            <AppShell>
              <BusinessContentReviewPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/profile"
        element={
          <ProtectedRoute allowedRoles={["BUSINESS"]}>
            <AppShell>
              <BusinessProfilePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/leaderboard"
        element={
          <ProtectedRoute allowedRoles={["BUSINESS"]}>
            <AppShell>
              <BusinessLeaderboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute allowedRoles={["CREATOR", "BUSINESS"]}>
            <AppShell>
              <LeaderboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
