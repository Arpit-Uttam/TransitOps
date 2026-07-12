import api from './api';

export const vehicleService = {
  // Fetch all vehicles
  getAllVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },

  // Register a new vehicle
  createVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },

  // Edit existing vehicle details
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  // Retire a vehicle
  retireVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  // Fetch all maintenance logs
  getAllMaintenanceLogs: async () => {
    const response = await api.get('/maintenance');
    return response.data;
  },

  // Start maintenance for a vehicle
  startMaintenance: async (vehicleId, description, cost) => {
    const response = await api.post(
      `/maintenance?vehicleId=${vehicleId}&description=${encodeURIComponent(description)}&cost=${cost}`
    );
    return response.data;
  },

  // Complete maintenance (restores vehicle status to Available)
  completeMaintenance: async (logId) => {
    const response = await api.put(`/maintenance/${logId}/complete`);
    return response.data;
  }
};
