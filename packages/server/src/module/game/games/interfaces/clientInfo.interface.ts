import { ConnectionType } from '@shared/types/connection.types';

export interface ClientInfo {
  pinCode: string;
  nickname: string;
  socketId: string;
  character: number;
  position: number;
  connection: ConnectionType;
}
