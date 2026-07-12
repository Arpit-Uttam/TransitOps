import api from './api';

export const expenseService = {
  // Fetch all logged expenses (Fuel, Tolls, Maintenance)
  getAllExpenses: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },

  // Log a fuel receipt (automatically triggers a parallel expense entry)
  logFuelPurchase: async (vehicleId, liters, cost) => {
    const response = await api.post(
      `/fuel?vehicleId=${vehicleId}&liters=${liters}&cost=${cost}`
    );
    return response.data;
  },

  // Log manual operational costs (tolls, parking, etc)
  logManualExpense: async (vehicleId, type, amount, description) => {
    const response = await api.post(
      `/expenses?vehicleId=${vehicleId}&type=${type}&amount=${amount}&description=${encodeURIComponent(description)}`
    );
    return response.data;
  },

  // Fetch compiled ROI and fuel efficiency reports per vehicle
  getRoiReports: async () => {
    const response = await api.get('/reports/roi');
    return response.data;
  },

  // Stream CSV export trigger
  triggerCsvExport: () => {
    // Directly opens the download window for CSV generation
    window.open('/api/reports/export/csv', '_blank');
  }
};