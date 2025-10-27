import api from '@/lib/api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types';
import { setAuthToken, setUser } from '@/lib/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { access_token, user } = response.data;
    
    setAuthToken(access_token);
    setUser(user);
    
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    const { access_token, user } = response.data;
    
    setAuthToken(access_token);
    setUser(user);
    
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
};
