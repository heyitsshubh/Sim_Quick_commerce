/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/hrApi.js
import axios from "axios";

export const getHRData = () =>
  axios.get("https://sim-quick-commerce-backend.onrender.com/api/hr/hr");

export const saveHRConfig = (data: any) =>
  axios.post("https://sim-quick-commerce-backend.onrender.com/api/hr/hr/save", data);