import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';

interface User {
  名前: string;
  メールアドレス: string;
  アバター?: string;
  権限: 'admin' | 'user';
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signup = useCallback(async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await apiClient.post<User>('/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // After successful signup, login the user
      const loginResponse = await apiClient.post<AuthResponse>('/auth/login', {
        username: formData.get('メールアドレス'),
        password: formData.get('パスワード'),
      });

      const { access_token } = loginResponse.data;
      localStorage.setItem('token', access_token);
      setUser(response.data);
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const login = useCallback(async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);

      // Get user data
      const userResponse = await apiClient.get<User>('/auth/me');
      setUser(userResponse.data);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  }, [router]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await apiClient.get<User>('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    signup,
    login,
    logout,
    checkAuth,
  };
} 