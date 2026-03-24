
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [adminId, setAdminId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified login for demo
    if (adminId === 'admin') {
      navigate('/admin/manage');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-10 text-center text-white space-y-4">
          <div className="w-16 h-16 bg-white/20 rounded-[20px] backdrop-blur-md mx-auto flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">GreenOffice Portal</h2>
            <p className="text-blue-100 text-sm font-medium mt-1">เจ้าหน้าที่กรุณาระบุรหัสผ่านเพื่อเข้าจัดการ</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Admin ID</label>
            <input 
              type="text" 
              value={adminId}
              onChange={e => setAdminId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
              placeholder="admin"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Access Code</label>
            <input 
              type="password" 
              value={accessCode}
              onChange={e => setAccessCode(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all text-lg"
          >
            เข้าสู่ระบบ
          </button>

          <button 
            type="button"
            onClick={() => navigate('/')}
            className="w-full text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
          >
            ยกเลิกและกลับสู่หน้าหลัก
          </button>
        </form>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
           <p className="text-[10px] text-slate-300 font-bold tracking-widest">SECURE LOGIN PROTOCOL • V1.0 (GREENOFFICE)</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
