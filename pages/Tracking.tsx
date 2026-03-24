
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { dataService } from '../services/dataService';

const Tracking: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setOrders(dataService.getOrders());
  }, []);

  const greenOrders = orders.filter(o => o.greenInfo.isGreen).length;
  const sustainabilityScore = orders.length > 0 ? Math.round((greenOrders / orders.length) * 100) : 0;

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">ติดตามสถานะการจัดซื้อ</h2>
        <p className="text-slate-400 mt-2 font-medium">ตรวจสอบความคืบหน้าและคะแนนความยั่งยืนของคุณ</p>
      </div>

      {/* Sustainability Score Card */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * sustainabilityScore) / 100} className="text-green-500 transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-1">
              <span className="text-2xl">🌱</span>
            </div>
            <span className="text-[10px] font-black text-white bg-green-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">Active</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Sustainability Score</p>
              <h3 className="text-4xl font-black text-slate-800">{sustainabilityScore}% <span className="text-xl font-bold text-green-500 ml-2">Green Starter</span></h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-800">{greenOrders} / {orders.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">รายการกรีน</p>
            </div>
          </div>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${sustainabilityScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-[32px] p-2 border border-gray-100 shadow-sm flex items-center gap-2">
        <input 
          type="text" 
          placeholder="กรอกเลขใบสั่งซื้อ (Bill ID) หรือชื่อผู้สั่ง..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent px-6 py-4 text-slate-600 outline-none font-medium"
        />
        <button className="bg-blue-50 text-blue-600 p-4 rounded-[24px] hover:bg-blue-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-blue-50/50 p-12 rounded-[40px] text-center space-y-4 border border-blue-100/30">
            <div className="text-4xl">💡</div>
            <h4 className="font-bold text-blue-800">ค้นหาด้วยเลขที่ใบสั่งซื้อ</h4>
            <p className="text-blue-500 text-sm max-w-xs mx-auto">ระบบจะแสดงข้อมูลแบบ Real-time จาก Google Cloud</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all cursor-pointer group">
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${order.greenInfo.isGreen ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                  {order.greenInfo.isGreen ? '🌿' : '📦'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800">{order.itemName}</h4>
                    {order.greenInfo.isGreen && <span className="text-[10px] font-black bg-green-500 text-white px-1.5 py-0.5 rounded uppercase">Green</span>}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {order.id} • {order.buyerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-slate-800">{order.quantity} {order.unit}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${
                    order.status === OrderStatus.APPROVED ? 'text-green-500' : order.status === OrderStatus.REJECTED ? 'text-red-500' : 'text-amber-500'
                  }`}>
                    {order.status}
                  </p>
                </div>
                <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tracking;
