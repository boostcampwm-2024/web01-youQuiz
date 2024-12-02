import { apiClient } from '..';

export function getPincodeExist(pinCode: string) {
  return apiClient.get(`/games/${pinCode}`);
}

export function checkPincodePossible(pinCode: string) {
  return apiClient.get(`/games/${pinCode}/check`);
}
