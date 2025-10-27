import Cookies from 'js-cookie';
import { User } from '@/types';

export const setAuthToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get('token');
};

export const removeAuthToken = () => {
  Cookies.remove('token');
};

export const setUser = (user: User) => {
  Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

export const getUser = (): User | null => {
  const userStr = Cookies.get('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const removeUser = () => {
  Cookies.remove('user');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const logout = () => {
  removeAuthToken();
  removeUser();
};
