import { apiClient } from '..';

interface ClassesResponse {
  id: number;
  title: string;
}

interface CreateClassRequest {
  title: string;
  description: string;
}

interface CreateClassResponse {
  id: number;
  title: string;
}

export async function getClasses(): Promise<ClassesResponse[]> {
  return await apiClient.get('/classes');
}

export async function createClass(data: CreateClassRequest): Promise<CreateClassResponse> {
  return await apiClient.post('/classes', {
    body: data,
  });
}

export async function deleteClass(id: number): Promise<void> {
  return await apiClient.delete(`/classes/${id}`);
}
