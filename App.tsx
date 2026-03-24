
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Shop from './pages/Shop';
import AdminOrders from './pages/AdminOrders';
import Reports from './pages/Reports';
import Tracking from './pages/Tracking';
import AdminLogin from './pages/AdminLogin';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/manage" element={<AdminOrders />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
