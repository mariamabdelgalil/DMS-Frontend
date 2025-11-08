import type { JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import Dashboard from "./pages/Dashboard";
import WorkspacePage from "./pages/WorkspacePage";
import RecycleBinPage from "./pages/RecyclebinPage";
import ProfilePage from "./pages/Profile";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import Layout from "./components/Layout";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = useSelector((state: RootState) => state.token);
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </Layout>
          }
        />

        <Route
          path="/workspace/:id"
          element={
            <Layout>
              <PrivateRoute>
                <WorkspacePage />
              </PrivateRoute>
            </Layout>
          }
        />

        <Route
          path="/recyclebin"
          element={
            <Layout>
              <PrivateRoute>
                <RecycleBinPage />
              </PrivateRoute>
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
