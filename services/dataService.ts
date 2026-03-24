
import { Order, OrderStatus } from '../types';

const STORAGE_KEY = 'ecomat_orders_v1';

// In a real app, these would call Google Sheets API and Google Drive API
export const dataService = {
  getOrders: (): Order[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  saveOrder: (order: Order): void => {
    const orders = dataService.getOrders();
    orders.push(order);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    console.log('Simulating sync to Google Sheets row...');
    if (order.greenInfo.proofImage) {
      console.log('Simulating image upload to Google Drive...');
    }
  },

  updateOrder: (updatedOrder: Order): void => {
    const orders = dataService.getOrders();
    const index = orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
      orders[index] = updatedOrder;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      console.log('Simulating Google Sheets update for ID:', updatedOrder.id);
    }
  },

  getFiscalYear: (date: Date): number => {
    // Thailand Fiscal Year starts Oct 1st of previous year
    // Example: Oct 2023 - Sep 2024 is Fiscal Year 2024
    const month = date.getMonth(); // 0-indexed
    const year = date.getFullYear();
    return month >= 9 ? year + 1 : year;
  }
};
