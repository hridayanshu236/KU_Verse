// utils/eventServices.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/event";

export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getallevents`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getRegisteredEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getregisteredevents`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getMyEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getmyevents`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchFeedEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getfeedevents`, {
      withCredentials: true,
    });
    return response.data.events;
  } catch (error) {
    console.error("Error fetching feed events:", error);
    throw error;
  }
};
export const getEventsForYou = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/for-you`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching feed events:", error);
    throw error;
  }
};


export const registerForEvent = async (eventId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/registerevent/${eventId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering for event:", error);
    throw error;
  }
};

export const createEvent = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createevent`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};


export const getEventById = async (eventId) => {
  try {
    console.log("Fetching event with ID:", eventId); 

    const response = await axios.get(`${API_BASE_URL}/getevent/${eventId}`, {
      withCredentials: true,
    });

    console.log("API Response:", response.data); 

    
    if (!response.data || !response.data.event) {
      throw new Error("Event data not found in response");
    }

    return response.data;
  } catch (error) {
    console.error("Error in getEventById:", error.response || error);
    if (error.response?.status === 404) {
      throw new Error("Event not found");
    }
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch event details"
    );
  }
};