import api from './api';

export const driverService = {
  // Fetch all registered drivers
  getAllDrivers: async () => {
    const response = await api.get('/drivers');
    return response.data;
  },

  // Register a new driver profile
  registerDriver: async (driverData) => {
    const response = await api.post('/drivers', driverData);
    return response.data;
  },

  // Update driver details (safety scores, status)
  updateDriver: async (id, driverData) => {
    const response = await api.put(`/drivers/${id}`, driverData);
    return response.data;
  },

  // Fetch all trip routes
  getAllTrips: async () => {
    const response = await api.get('/trips');
    return response.data;
  },

  // Create a new trip (validates cargo capacity and license status)
  createTrip: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  // Dispatch a planned trip route (sets vehicle and driver status to On Trip)
  dispatchTrip: async (tripId) => {
    const response = await api.put(`/trips/${tripId}/dispatch`);
    return response.data;
  },

  // Complete a dispatched trip (restores vehicle & driver to Available, updates odometer)
  completeTrip: async (tripId, actualDistance, fuelConsumed) => {
    const response = await api.put(
      `/trips/${tripId}/complete?actualDistance=${actualDistance}&fuelConsumed=${fuelConsumed}`
    );
    return response.data;
  },

  // Cancel an active trip (restores vehicle & driver to Available)
  cancelTrip: async (tripId) => {
    const response = await api.put(`/trips/${tripId}/cancel`);
    return response.data;
  }
};
