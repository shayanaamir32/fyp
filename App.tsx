import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Auth from "./components/Auth";
import Login from "./components/Login";
import Home from "./components/Home";
import GenerateImage from "./components/GenerateImage";
import ContactVendors from "./components/ContactVendors";
import MyVendors from "./components/MyVendors";
import VendorChat from "./components/VendorChar";
import VendorDetails from "./components/VendorDetails";
import SendOffer from "./components/SendOffer";
import VendorOffers from "./components/VendorOffer";
import VendorDashboard from "./components/VendorDashboard";
import ChatBot from "./components/Chatbot";


// RoleRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const RoleRoute = ({ role, allowedRoles, redirectTo }) => {
  if (!role) return <Navigate to="/" />;
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to={redirectTo} />;
};

const PublicRoute = ({ role, children }) => {
  if (role) {
    // Redirect user or vendor to their dashboard
    return <Navigate to={role === 'vendor' ? '/vendor-dashboard' : '/home'} />;
  }
  return children;
};

const PrivateRoute = ({ role, allowedRoles, children }) => {
  if (!role) return <Navigate to="/login" />;

  if (!allowedRoles.includes(role)) {
    // Redirect to proper dashboard if wrong role accesses a route
    return <Navigate to={role === "vendor" ? "/vendor-dashboard" : "/home"} />;
  }

  return children;
};

// This component is inside <Router>
function Layout() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('auth') as string);
  const role = user?.role ?? null;
  console.log(role, "role is ")


  // Check if path starts with "/chat/"
  const isChatPage = location.pathname.startsWith("/chat/");

  return (
    <div className="min-h-screen bg-gray-100 text-[#120727] flex flex-col">
      <Header />
      <div className="flex-grow">
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              <PublicRoute role={role}>
                <Auth />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute role={role}>
                <Login />
              </PublicRoute>
            }
          />

          {/* User routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute role={role} allowedRoles={["user"]}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/generate-image"
            element={
              <PrivateRoute role={role} allowedRoles={["user"]}>
                <GenerateImage />
              </PrivateRoute>
            }
          />
          <Route
            path="/contact-vendors"
            element={
              <PrivateRoute role={role} allowedRoles={["user"]}>
                <ContactVendors />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-vendors"
            element={
              <PrivateRoute role={role} allowedRoles={["user"]}>
                <MyVendors />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:id"
            element={
                <VendorChat />
            }
          />
          <Route
            path="/vendor/:vendorId"
            element={
              <PrivateRoute role={role} allowedRoles={["user"]}>
                <VendorDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/send-offer/:vendorId"
            element={
              <PrivateRoute role={role} allowedRoles={["user"]}>
                <SendOffer />
              </PrivateRoute>
            }
          />
          <Route
            path="/vendor-offers"
            element={
              <PrivateRoute role={role} allowedRoles={["user"]}>
                <VendorOffers />
              </PrivateRoute>
            }
          />

          {/* Vendor Routes */}
          <Route
            path="/vendor-dashboard"
            element={
              <PrivateRoute role={role} allowedRoles={["vendor"]}>
                <VendorDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      {/* Only show ChatBot if not in chat page */}
      {!isChatPage && <ChatBot />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout /> {/* Now useLocation works fine inside here */}
    </Router>
  );
}

export default App;
