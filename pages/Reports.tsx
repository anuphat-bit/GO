
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Order } from '../types';
import { dataService } from '../services/dataService';

const Reports: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reportMode, setReportMode] = useState<'CALENDAR' | 'FISCAL'>('CALENDAR');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setOrders(dataService.getOrders());
  }, []);

  const filteredOrders = orders.filter(o => 
    reportMode === 'CALENDAR' ? o.calendarYear === selectedYear : o.fiscalYear === selectedYear
  );

  const stats = {
    total: filteredOrders.length,
    greenCount: filteredOrders.filter(o => o.greenInfo.isGreen).length,
    totalValue: filteredOrders.reduce((sum, o) => sum + (o.adminPrice || 0), 0),
    greenValue: filteredOrders.filter(o => o.greenInfo.isGreen).reduce((sum, o) => sum + (o.adminPrice || 0), 0)
  };

  const greenRatio = stats.total > 0 ? (stats.greenCount / stats.total) * 100 : 0;
  const greenBudgetRatio = stats.totalValue > 0 ? (stats.greenValue / stats.totalValue) * 100 : 0;

  const deptData = Array.from(new Set(filteredOrders.map(o => o.department))).map(dept => ({
    name: dept,
    green: filteredOrders.filter(o => o.department === dept && o.greenInfo.isGreen).length
  })).sort((a,b) => b.green - a.green);

  const handleExport = () => {
    const csvRows = [
      ['ID', 'Date', 'Item', 'Qty', 'Unit', 'Price', 'Green', 'Label', 'Department'],
      ...filteredOrders.map(o => [
        o.id,
        new Date(o.createdAt).toLocaleDateString(),
        o.itemName,
        o.quantity,
        o.unit,
        o.adminPrice || 0,
        o.greenInfo.isGreen ? 'YES' : 'NO',
        o.greenInfo.label,
        o.department
      ])
    ];
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GreenOffice_Report_${selectedYear}.csv`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">รายงานวัสดุกรีนสำนักงาน</h2>
          <p className="text-slate-400 mt-2 font-medium italic">ติดตามความคืบหน้าการจัดซื้อวัสดุที่เป็นมิตรต่อสิ่งแวดล้อม</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-slate-900 text-white px-8 py-4 rounded-[20px] text-sm font-black hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          ส่งออกข้อมูล CSV
        </button>
      </div>

      {/* Year Selector */}
      <div className="bg-white rounded-[24px] p-2 border border-gray-100 shadow-sm flex items-center gap-4 max-w-sm">
        <select 
          value={reportMode} 
          onChange={e => setReportMode(e.target.value as any)}
          className="bg-transparent font-black text-slate-600 px-4 py-2 border-none focus:ring-0 cursor-pointer text-xs uppercase"
        >
          <option value="CALENDAR">ปีปฏิทิน</option>
          <option value="FISCAL">ปีงบประมาณ</option>
        </select>
        <div className="h-4 w-px bg-gray-200"></div>
        <select 
          value={selectedYear} 
          onChange={e => setSelectedYear(parseInt(e.target.value))}
          className="bg-transparent font-black text-slate-800 px-4 py-2 border-none focus:ring-0 cursor-pointer"
        >
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard 
          label="รายการวัสดุกรีน" 
          value={`${stats.greenCount} / ${stats.total}`} 
          percentage={`${greenRatio.toFixed(1)}% ของทั้งหมด`}
          color="border-green-400"
          valueColor="text-green-600"
        />
        <MetricCard 
          label="ยอดจัดซื้อวัสดุกรีน" 
          value={`฿${stats.greenValue.toLocaleString()}`} 
          percentage={`${greenBudgetRatio.toFixed(1)}% ของงบรวม`}
          color="border-blue-400"
          valueColor="text-blue-600"
        />
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm border-l-[10px] border-l-orange-400">
           <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">เป้าหมาย Green Office</span>
           </div>
           <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden relative mb-4">
              <div className="h-full bg-green-500 transition-all duration-1000" style={{width: `${greenRatio}%`}}></div>
              <div className="absolute top-0 right-1/4 h-full w-px bg-slate-400"></div>
           </div>
           <div className="flex justify-between text-[10px] font-bold">
              <span className="text-green-600">ปัจจุบัน {greenRatio.toFixed(1)}%</span>
              <span className="text-slate-400">เป้าหมายองค์กร 60%</span>
           </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-black text-slate-800 mb-8 self-start">สัดส่วนวัสดุที่ใช้</h3>
          <div className="w-full aspect-square max-w-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={[
                    { name: 'กรีน', value: stats.greenCount, color: '#22c55e' },
                    { name: 'ทั่วไป', value: stats.total - stats.greenCount, color: '#e2e8f0' }
                  ]}
                  innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value"
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#e2e8f0" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{greenRatio.toFixed(0)}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Green Mix</span>
            </div>
          </div>
          <div className="mt-8 space-y-4 w-full">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs font-bold text-green-700">วัสดุกรีน</span>
              </div>
              <span className="text-sm font-black text-green-700">{stats.greenCount}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-xs font-bold text-slate-500">วัสดุทั่วไป</span>
              </div>
              <span className="text-sm font-black text-slate-500">{stats.total - stats.greenCount}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-8">สถิติการสั่งซื้อวัสดุกรีนรายแผนก / ฝ่ายงาน</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={150} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="green" fill="#22c55e" radius={[0, 10, 10, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; percentage: string; color: string; valueColor: string }> = ({ label, value, percentage, color, valueColor }) => (
  <div className={`bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm border-l-[10px] ${color}`}>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
    <div className={`text-3xl font-black ${valueColor}`}>{value}</div>
    <p className="text-[10px] font-bold text-green-500 mt-2 bg-green-50 inline-block px-2 py-1 rounded-lg">{percentage}</p>
  </div>
);

export default Reports;
