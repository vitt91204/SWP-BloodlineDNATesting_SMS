import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Page imports
import Index from "@/pages/Index";
import Services from "@/pages/Services";
import Process from "@/pages/Process";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Results from "@/pages/Results";
import Booking from "@/pages/Booking";
import Payment from "@/pages/Payment";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import CustomerProfile from "@/pages/customer/Profile";
import TestResultDetail from "@/pages/customer/TestResultDetail";
import { Settings } from "@/pages/Settings";

// Admin pages
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import Customers from "@/pages/admin/account/Customer";

import Appointments from "@/pages/admin/Appointments";
import TestServiceManagement from "@/pages/admin/TestServiceManagement";
import TestKitManagement from "@/pages/admin/TestKitManagement";
import SampleManagement from "@/pages/admin/SampleManagement";
import TestResultsManagement from "@/pages/admin/TestResultsManagement";

// Staff pages
import StaffDashboard from "@/pages/staff/Dashboard";
import BlogDetail from "./pages/Blogdetails";

// Manager pages
import ManagerDashboard from "@/pages/manager/Dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/process" element={<Process />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/results" element={<Results />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/blog/:id" element={<BlogDetail />} />

            

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User profile route */}
            <Route path="/profile" element={<CustomerProfile />} />
            <Route path="/test-result/:resultId" element={<TestResultDetail />} />
            <Route path="/settings" element={<Settings />} />

            {/* Staff routes */}
            <Route path="/staff" element={<StaffDashboard />} />
            
            {/* Manager routes */}
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />

            {/* Blog routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />


            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerProfile />} />

              <Route path="appointments" element={<Appointments />} />
              <Route path="test-services" element={<TestServiceManagement />} />
              <Route path="test-kits" element={<TestKitManagement />} />
              <Route path="samples" element={<SampleManagement />} />
              <Route path="test-results" element={<TestResultsManagement />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
