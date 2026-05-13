import axiosClient from "./axiosClient";

export const fetchTransactionsByDate = async (date) => {
  const response = await axiosClient.get("/transactions", {
    params: { date },
  });

  return response.data;
};

export const createTransaction = async (transaction) => {
  const response = await axiosClient.post("/transactions", transaction);
  return response.data;
};