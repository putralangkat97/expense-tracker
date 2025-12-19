const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const walletService = {
  async createWallet(data) {
    const response = await fetch(`${API_URL}/wallets`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create wallet");
    }

    return result;
  },

  async getWallets(userId) {
    const response = await fetch(`${API_URL}/wallets/user/${userId}`, {
      headers: getHeaders(),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to get wallets");
    }

    return result;
  },

  async updateWallet(id, data) {
    const response = await fetch(`${API_URL}/wallets/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update wallet");
    }

    return result;
  },
};

export const budgetService = {
  async createBudget(data) {
    const response = await fetch(`${API_URL}/budgets`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create budget");
    }

    return result;
  },

  async getBudgets(userId) {
    const response = await fetch(`${API_URL}/budgets/user/${userId}`, {
      headers: getHeaders(),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to get budgets");
    }

    return result;
  },

  async updateBudget(id, data) {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update budget");
    }

    return result;
  },

  async deleteBudget(id) {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete budget");
    }

    return result;
  },
};

export const categoryService = {
  async getCategories() {
    const response = await fetch(`${API_URL}/categories`, {
      headers: getHeaders(),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to get categories");
    }

    return result;
  },
};

export const transactionService = {
  async getTransactions(userId) {
    const response = await fetch(`${API_URL}/transactions/user/${userId}`, {
      headers: getHeaders(),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to get transactions");
    }

    return result;
  },

  async getTransactionsByWallet(walletId) {
    const response = await fetch(`${API_URL}/transactions/wallet/${walletId}`, {
      headers: getHeaders(),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to get wallet transactions");
    }

    return result;
  },

  async createTransaction(data) {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create transaction");
    }

    return result;
  },

  async updateTransaction(id, data) {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update transaction");
    }

    return result;
  },

  async deleteTransaction(id) {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete transaction");
    }

    return result;
  },
};
