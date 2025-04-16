

import React, {  useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
} from 'react-router-dom';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ScrollReveal from 'scrollreveal';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import HotelDetail from './components/HotelDetails/HotelDetail';
import Reservation from './components/Reservation';
import Home from './components/Home';
import Offers from './components/Offers';
import Hotels from './components/Hotels';
import Profile from './components/Client/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'font-awesome/css/font-awesome.min.css';

import { AnimatePresence } from 'framer-motion';
import AppWrapper from './AppWrapper';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Routes sans mise en page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        

        {/* Routes avec layout commun */}
        <Route element={<LayoutWithNavbarFooter />}>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/offers" element={<Offers />} /> 
          <Route path="/profile" element={<Profile/>} />
        
          {/* Route imbriquée avec dialog */}
          <Route path="/hotel/:id" element={<HotelDetail />}>
           <Route path="reservation/:offreId" element={<Reservation />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

// Layout réutilisable
function LayoutWithNavbarFooter() {
  const location = useLocation();

  useEffect(() => {
    const sr = ScrollReveal({
      origin: 'top',
      distance: '80px',
      duration: 2000,
      reset: true,
    });
    sr.reveal(
      `
        #nav,
        #hero,
        #services,
        #recommend,
    
        #footer
      `,
      {
        opacity: 0,
        interval: 300,
      }
    );
  }, [location.pathname]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
}
