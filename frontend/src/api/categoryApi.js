import axiosClient from "./axiosClient";

export const fetchCategories = async () => {
  const response = await axiosClient.get("/categories");
  return response.data;
};