import api from '@/lib/api';
import { Patient, CreatePatientDto } from '@/types';

export const patientService = {
  async getAll(): Promise<Patient[]> {
    const response = await api.get<Patient[]>('/patients');
    return response.data;
  },

  async getById(id: string): Promise<Patient> {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  async create(data: CreatePatientDto): Promise<Patient> {
    const response = await api.post<Patient>('/patients', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreatePatientDto>): Promise<Patient> {
    const response = await api.patch<Patient>(`/patients/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/patients/${id}`);
  },

  async search(query: string): Promise<Patient[]> {
    const response = await api.get<Patient[]>(`/patients?search=${query}`);
    return response.data;
  },
};
