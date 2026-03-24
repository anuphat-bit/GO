
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname === '/reports';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-10 lg:px-20 h-20 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
            <span className="text-white font-bold text-lg sm:text-xl">GO</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight hidden xs:block">GreenOffice</h1>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2 lg:gap-4 mx-2 overflow-x-auto no-scrollbar">
          {!isAdmin ? (
            <>
              <Link
                to="/"
                className={`whitespace-nowrap px-3 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  location.pathname === '/' ? 'bg-green-100 text-green-700' : 'text-slate-500 hover:bg-gray-50'
                }`}
              >
                เลือกซื้อวัสดุ
              </Link>
              <Link
                to="/tracking"
                className={`whitespace-nowrap px-3 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  location.pathname === '/tracking' ? 'bg-green-100 text-green-700' : 'text-slate-500 hover:bg-gray-50'
                }`}
              >
                ติดตามสถานะ
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/admin/manage"
                className={`whitespace-nowrap px-3 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  location.pathname === '/admin/manage' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-gray-50'
                }`}
              >
                จัดการคำสั่งซื้อ
              </Link>
              <Link
                to="/reports"
                className={`whitespace-nowrap px-3 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  location.pathname === '/reports' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-gray-50'
                }`}
              >
                รายงานสรุป
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 hidden xs:block">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <Link
            to={isAdmin ? "/" : "/admin"}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            {isAdmin ? "ออก" : "แอดมิน"}
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-10 lg:px-20">
        {children}
      </main>

      <footer className="py-6 text-center border-t border-gray-100 bg-white">
        <p className="text-[10px] text-slate-300 font-bold tracking-widest uppercase px-4">
          GreenOffice V1.0 • Sustainability System
        </p>
        <p className="text-[10px] text-slate-300 mt-1 px-4">
          DATA SYNCHRONIZED TO YOUR WORKSPACE CLOUD
        </p>
      </footer>
    </div>
  );
};

export default Layout;
