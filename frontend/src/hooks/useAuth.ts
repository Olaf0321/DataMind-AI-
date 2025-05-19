import { useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  'id': number;
  '名前': string;
  'メールアドレス': string;
  'アバター': string;
  '権限': string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const signup = useCallback(async (formData: FormData) => {
    try {
      const response = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);

      // Fetch user data after successful signup
      const userResponse = await axios.get<User>(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // console.log('User data:', userResponse);
      
      localStorage.setItem("user", JSON.stringify(userResponse.data));
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      // const response = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, formData, {
        const response = await axios.post<AuthResponse>('http://localhost:8080/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);

      // Fetch user data after successful login
      const userResponse = await axios.get<User>(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log('User data:', userResponse);
      
      localStorage.setItem("user", JSON.stringify(userResponse.data));
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  }, [router]);

  return {
    user,
    signup,
    login,
    logout,
  };
} 