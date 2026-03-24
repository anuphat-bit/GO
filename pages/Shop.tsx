
import React, { useState } from 'react';
import { DEPARTMENTS, GREEN_LABELS } from '../constants';
import { Order, OrderStatus, GreenLabel } from '../types';
import { dataService } from '../services/dataService';

const Shop: React.FC = () => {
  const [buyerName, setBuyerName] = useState('');
  const [department, setDepartment] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  const [specs, setSpecs] = useState('');
  const [isGreen, setIsGreen] = useState(false);
  const [greenLabel, setGreenLabel] = useState<GreenLabel>(GreenLabel.NONE);
  const [image, setImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmAndSubmit = () => {
    const now = new Date();
    const newOrder: Order = {
      id: `BILL-${Math.floor(Math.random() * 100000000)}`,
      createdAt: now.toISOString(),
      buyerName,
      department,
      itemName,
      quantity,
      unit,
      specs,
      status: OrderStatus.PENDING,
      greenInfo: {
        isGreen,
        label: isGreen ? greenLabel : GreenLabel.NONE,
        proofImage: image || undefined
      },
      fiscalYear: dataService.getFiscalYear(now),
      calendarYear: now.getFullYear()
    };

    dataService.saveOrder(newOrder);
    setShowSuccess(true);
    setShowConfirmDialog(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset form
    setBuyerName(''); setDepartment(''); setItemName(''); setQuantity(1); setUnit(''); setSpecs(''); setIsGreen(false); setGreenLabel(GreenLabel.NONE); setImage(null);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-1 sm:px-0">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">แบบฟอร์มขอจัดซื้อวัสดุสำนักงาน</h2>
        <p className="text-slate-400 mt-2 font-medium text-sm sm:text-base px-4">กรุณากรอกรายละเอียดผู้สั่งซื้อและวัสดุที่ต้องการ</p>
      </div>

      {showSuccess && (
        <div className="mb-8 bg-green-500 text-white p-5 sm:p-6 rounded-3xl shadow-lg shadow-green-100 animate-fadeIn flex items-center justify-between">
          <div>
            <h4 className="font-bold text-base sm:text-lg">ส่งคำขอสำเร็จ!</h4>
            <p className="text-green-100 text-xs sm:text-sm">รายการของคุณถูกบันทึกลง Google Sheets เรียบร้อยแล้ว</p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="bg-white/20 p-2 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmitAttempt} className="bg-white rounded-3xl sm:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-10 lg:p-12 space-y-8 sm:space-y-10">
          
          {/* Section 1: Buyer Info */}
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 text-slate-800 border-b border-gray-50 pb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
              </div>
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-tight">ข้อมูลผู้สั่งซื้อ</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-600">ชื่อ-นามสกุล ผู้สั่งซื้อ *</label>
                <input 
                  type="text" 
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm sm:text-base"
                  placeholder="ระบุชื่อจริง..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-600">แผนก / ฝ่าย *</label>
                <select 
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm sm:text-base appearance-none cursor-pointer"
                  required
                >
                  <option value="">โปรดเลือกแผนก/ฝ่าย</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Item Info */}
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 text-slate-800 border-b border-gray-50 pb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path></svg>
              </div>
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-tight">รายละเอียดรายการวัสดุ</h3>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-600">ชื่อวัสดุ / รายการสินค้า *</label>
                <input 
                  type="text" 
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm sm:text-base"
                  placeholder="เช่น กระดาษ A4, ปากกาเคมี, หมึกพิมพ์..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-600">จำนวน *</label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-600">หน่วยนับ *</label>
                  <input 
                    type="text" 
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm sm:text-base"
                    placeholder="เช่น รีม, กล่อง, ชุด..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-600">สเปคเพิ่มเติม</label>
                <textarea 
                  value={specs}
                  onChange={e => setSpecs(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-green-500 outline-none transition-all min-h-[100px] text-sm sm:text-base"
                  placeholder="สี, ยี่ห้อ, หรือขนาด..."
                />
              </div>
            </div>
          </section>

          {/* Section 3: Sustainability */}
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 text-slate-800 border-b border-gray-50 pb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.945 1.183a1 1 0 01.69 1.255l-1.457 4.852a1 1 0 01-.658.67L10 13.362V18a1 1 0 11-2 0v-4.638l-3.52-1.04a1 1 0 01-.658-.67L2.365 6.76a1 1 0 01.69-1.255L7 4.323V3a1 1 0 011-1h2z" clipRule="evenodd"></path></svg>
              </div>
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-tight">ความยั่งยืน</h3>
            </div>

            <div className={`p-5 sm:p-6 rounded-3xl sm:rounded-[32px] border transition-all ${isGreen ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
              <label className="flex items-center gap-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isGreen}
                  onChange={e => setIsGreen(e.target.checked)}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div>
                  <span className="text-base sm:text-lg font-bold text-slate-800">เป็นวัสดุรักษ์โลก (Green Material)</span>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">เลือกข้อนี้หากวัสดุมีฉลากเขียว หรือทำจากวัสดุรีไซเคิล</p>
                </div>
              </label>

              {isGreen && (
                <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-green-700 uppercase tracking-widest">ประเภทการรับรอง</label>
                    <select 
                      value={greenLabel}
                      onChange={e => setGreenLabel(e.target.value as GreenLabel)}
                      className="w-full bg-white border border-green-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-700 text-sm sm:text-base appearance-none cursor-pointer"
                    >
                      <option value={GreenLabel.NONE}>โปรดเลือกประเภทการรับรอง</option>
                      {GREEN_LABELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-green-700 uppercase tracking-widest">แนบภาพประกอบ (ถ้ามี)</label>
                    <div className="relative group min-h-[140px] sm:min-h-[160px]">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full h-full min-h-[140px] sm:min-h-[160px] border-2 border-dashed border-green-200 rounded-[24px] sm:rounded-[32px] bg-white flex flex-col items-center justify-center gap-2 group-hover:bg-green-50 transition-colors">
                        {image ? (
                          <img src={image} className="w-full h-full max-h-[120px] object-contain p-4" alt="Preview" />
                        ) : (
                          <>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-green-600">อัปโหลดรูปภาพ</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="button" 
              className="w-full sm:flex-1 flex items-center justify-center gap-3 px-6 py-4 sm:py-5 border-2 border-orange-500 text-orange-600 font-bold rounded-2xl sm:rounded-[24px] hover:bg-orange-50 transition-all text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              เพิ่มลงตะกร้า
            </button>
            <button 
              type="submit" 
              className="w-full sm:flex-[2] px-6 py-4 sm:py-5 bg-green-600 text-white font-bold rounded-2xl sm:rounded-[24px] shadow-xl shadow-green-100 hover:bg-green-700 transition-all text-base sm:text-lg"
            >
              ส่งคำขอจัดซื้อทันที
            </button>
          </div>
        </div>
      </form>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]">
            <div className="p-6 sm:p-8 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">ยืนยันการส่งคำขอ?</h3>
              <p className="text-slate-400 mt-1 font-medium text-sm">กรุณาตรวจสอบข้อมูลก่อนกดส่งรายการ</p>
            </div>
            
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div className="bg-gray-50 rounded-[24px] sm:rounded-[32px] p-6 space-y-4 border border-gray-100">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">รายการวัสดุ</label>
                    <p className="font-bold text-lg sm:text-xl text-slate-800 break-words">{itemName}</p>
                    <p className="text-green-600 font-bold mt-0.5">{quantity} {unit}</p>
                  </div>
                  {isGreen && (
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl">
                      🌿
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">ผู้สั่งซื้อ</label>
                      <p className="text-sm font-bold text-slate-700 truncate">{buyerName}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">แผนก</label>
                      <p className="text-sm font-bold text-blue-600 truncate">{department}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2 flex-shrink-0">
                <button 
                  onClick={() => setShowConfirmDialog(false)}
                  className="w-full sm:flex-1 px-6 py-4 border-2 border-gray-100 text-slate-400 font-bold rounded-[20px] hover:bg-gray-50 transition-all text-sm"
                >
                  ย้อนกลับ
                </button>
                <button 
                  onClick={confirmAndSubmit}
                  className="w-full sm:flex-[2] px-6 py-4 bg-green-600 text-white font-black rounded-[20px] shadow-lg shadow-green-100 hover:bg-green-700 transition-all text-sm"
                >
                  ยืนยันส่งคำขอ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
