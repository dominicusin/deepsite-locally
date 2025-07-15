import axios from "axios";


export const api = axios.create({
  baseURL: `/api`,
  headers: {
    cache: "no-store",
  },
});

export const apiServer = axios.create({
  baseURL: process.env.NEXT_APP_API_URL as string,
  headers: {
    cache: "no-store",
  },
});

api.interceptors.request.use((config) => {
  return config;
});
