import { UserEntity } from '../entities';

export type AuthResponse = {
  user: UserEntity;
  accessToken: string;
};
