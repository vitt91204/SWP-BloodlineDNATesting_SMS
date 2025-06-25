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
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import CustomerProfile from "@/pages/customer/Profile";

// Admin pages
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import Customers from "@/pages/admin/account/Customer";
import Tests from "@/pages/admin/Tests";
import Appointments from "@/pages/admin/Appointments";

// Staff pages
import StaffDashboard from "@/pages/staff/Dashboard";

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

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User profile route */}
            <Route path="/profile" element={<CustomerProfile />} />

            {/* Staff routes */}
            <Route path="/staff" element={<StaffDashboard />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerProfile />} />
              <Route path="tests" element={<Tests />} />
              <Route path="appointments" element={<Appointments />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
