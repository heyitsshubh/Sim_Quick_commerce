import axios from 'axios';

const API_BASE = 'https://sim-quick-commerce-backend.onrender.com/api';

export const createSimulation = async (name: string, totalRounds: number) => {
  const res = await axios.post(`${API_BASE}/simulation/create`, {
    name,
    totalRounds,
  });
  return res.data;
};

export const createGroup = async (name: string, simulationId: string) => {
  const res = await axios.post(`${API_BASE}/group/create`, {
    name,
    simulationId,
  });
  return res.data;
};

export const createUser = async (
  username: string,
  password: string,
  simulationId: string,
  groupId: string
) => {
  const res = await axios.post(`${API_BASE}/auth/create-user`, {
    username,
    password,
    simulationId,
    groupId,
  });
  return res.data;
};
