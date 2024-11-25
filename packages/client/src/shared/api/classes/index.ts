import { apiClient } from '..';

interface ClassesResponse {
  id: number;
  title: string;
}

interface CreateClassRequest {
  title: string;
  description: string;
}

export async function getClasses(): Promise<ClassesResponse[]> {
  return await apiClient.get('/classes');
}

export async function createClass(data: CreateClassRequest) {
  return await apiClient.post('/classes', {
    body: data,
  });
}
