import axiosClient from "./axiosClient";

export const fetchMonthlySummary = async (year, month) => {
  const response = await axiosClient.get("/summaries/month", {
    params: {
      year,
      month,
    },
  });

  return response.data;
};