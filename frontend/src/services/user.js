import { API_URL } from "./constant";

const getHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const userService = {
  async updateUser(userId, data) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update profile");
    }

    return result;
  },

  async getUser(userId) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: getHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to get user");
    }

    return result;
  },
};
