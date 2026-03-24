
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { dataService } from '../services/dataService';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ทั้งหมด');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminPrice, setAdminPrice] = useState<number>(0);
  const [adminNotes, setAdminNotes] = useState<string>('');

  useEffect(() => {
    setOrders(dataService.getOrders());
  }, []);

  const handleUpdateStatus = (status: OrderStatus) => {
    if (!selectedOrder) return;
    const updated: Order = {
      ...selectedOrder,
      status,
      adminPrice: adminPrice || selectedOrder.adminPrice,
      adminNotes: adminNotes || selectedOrder.adminNotes
    };
    dataService.updateOrder(updated);
    setOrders(dataService.getOrders());
    setSelectedOrder(null);
    setAdminPrice(0);
    setAdminNotes('');
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         o.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ทั้งหมด' || 
                         (statusFilter === 'รอการอนุมัติ' && o.status === OrderStatus.PENDING) || 
                         (statusFilter === 'อนุมัติแล้ว' && o.status === OrderStatus.APPROVED);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">จัดการคำสั่งซื้อ</h2>
        </div>
        <div className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap">
          ทั้งหมด: {orders.length} รายการ
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-1 border border-gray-100">
          <input 
            type="text" 
            placeholder="ค้นหาชื่อผู้สั่ง, ใบสั่งซื้อ หรือวัสดุ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 outline-none font-medium text-slate-600 text-sm sm:text-base"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {['ทั้งหมด', 'รอการอนุมัติ', 'อนุมัติแล้ว', 'ถูกปฏิเสธ'].map(tab => (
              <button 
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${statusFilter === tab ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="text-blue-500 text-[10px] sm:text-xs font-bold hover:underline" onClick={() => {setSearchTerm(''); setStatusFilter('ทั้งหมด');}}>ล้างค่า</button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-6 sm:px-8 py-4 sm:py-6 text-left">ผู้สั่งซื้อ & แผนก</th>
                <th className="px-6 sm:px-8 py-4 sm:py-6 text-left">รายการวัสดุ</th>
                <th className="px-6 sm:px-8 py-4 sm:py-6 text-left">จำนวน</th>
                <th className="px-6 sm:px-8 py-4 sm:py-6 text-left">สถานะ</th>
                <th className="px-6 sm:px-8 py-4 sm:py-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-bold italic">ไม่พบข้อมูลรายการ</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                      <h5 className="font-bold text-slate-800 text-sm">{order.buyerName}</h5>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">BILL: {order.id}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase mt-0.5">{order.department}</p>
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{order.itemName}</span>
                        {order.greenInfo.isGreen && (
                          <span className="text-[8px] font-black bg-green-500 text-white px-1 py-0.5 rounded uppercase">Green</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                      <span className="font-bold text-slate-800 text-sm">{order.quantity} {order.unit}</span>
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        order.status === OrderStatus.APPROVED ? 'bg-green-100 text-green-700' : order.status === OrderStatus.REJECTED ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-6 text-right">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setAdminPrice(order.adminPrice || 0);
                          setAdminNotes(order.adminNotes || '');
                        }}
                        className="text-blue-600 font-black text-xs hover:text-blue-800 transition-colors uppercase tracking-widest"
                      >
                        ตรวจสอบ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]">
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-start flex-shrink-0">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800">ตรวจสอบคำขอ</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ITEM-{selectedOrder.id.replace('BILL-','')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 sm:p-10 space-y-6 sm:space-y-8 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">ผู้สั่ง</label>
                  <p className="font-black text-lg sm:text-xl text-slate-800">{selectedOrder.buyerName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">แผนก</label>
                  <p className="font-black text-lg sm:text-xl text-blue-600">{selectedOrder.department}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-gray-100 relative overflow-hidden">
                <div className="relative z-10">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">รายการที่ต้องการ</label>
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">{selectedOrder.itemName}</h4>
                  <p className="text-xl sm:text-2xl font-black text-green-600 mt-1">จำนวน: {selectedOrder.quantity} {selectedOrder.unit}</p>
                  
                  {selectedOrder.specs && (
                    <div className="mt-4 bg-white/60 p-4 rounded-2xl border border-gray-100 text-sm font-medium text-slate-500 italic">
                      "{selectedOrder.specs}"
                    </div>
                  )}
                </div>
                {selectedOrder.greenInfo.isGreen && (
                  <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 opacity-10 flex items-center justify-center">
                    <span className="text-6xl sm:text-8xl">🌿</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-xs font-black text-slate-700 uppercase tracking-widest">ระบุราคาสรุป (บาท)</label>
                  <input 
                    type="number" 
                    value={adminPrice}
                    onChange={e => setAdminPrice(parseFloat(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 sm:px-8 py-4 sm:py-5 text-xl sm:text-2xl font-black text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-xs font-black text-slate-700 uppercase tracking-widest">หมายเหตุ/ข้อความถึงผู้สั่ง</label>
                  <textarea 
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 sm:px-8 py-4 sm:py-5 text-sm font-bold text-slate-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all min-h-[100px]"
                    placeholder="ระบุเหตุผลการปฏิเสธ หรือข้อมูลการจัดส่ง..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                <button 
                  onClick={() => handleUpdateStatus(OrderStatus.REJECTED)}
                  className="w-full sm:flex-1 px-6 py-4 border-2 border-red-100 text-red-600 font-black rounded-2xl hover:bg-red-50 transition-all text-base sm:text-lg"
                >
                  ปฏิเสธคำขอ
                </button>
                <button 
                  onClick={() => handleUpdateStatus(OrderStatus.APPROVED)}
                  className="w-full sm:flex-[2] px-6 py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:bg-green-700 transition-all text-base sm:text-lg"
                >
                  อนุมัติคำขอจัดซื้อ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
