'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';
import Image from 'next/image';
interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data.username, data.password);
      router.push('/home');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || 'ログインに失敗しました');
      } else {
        setError('ログインに失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-cover bg-center bg-no-repeat bg-[url('/images/top.png')] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="header fixed top-0 left-0 w-full h-[100px] z-50 flex justify-start items-center px-10 mt-5">
        <Image src="/images/Vector.png" className='mr-3 mt-2' alt="logo" width={70} height={70} />
        <Image src="/images/CLOUD-SHIFT.png" alt="logo" width={350} height={350} />
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <div className="bg-[#0E538CB0] opacity-100 pt-28 pb-6 px-4 shadow sm:rounded-2xl sm:px-8 relative">
          <div className="flex justify-center absolute top-[-80px] left-[50%] translate-x-[-50%]">
            <Image src="/images/logo(1).png" alt="logo" width={160} height={160} />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="username" className="block text-[15px] text-white">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="email"
                  {...register('username', {
                    required: 'メールアドレスを入力してください',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: '有効なメールアドレスを入力してください',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 bg-[#FFFFFF6B] opacity-100 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-0 focus: bg-[#FFFFFF6B] sm:text-[15px]"
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <label htmlFor="password" className="block text-[15px] text-white">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'パスワードを入力してください',
                  })}
                  className="appearance-none block w-full px-3 py-2 bg-[#FFFFFF6B] opacity-100 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-0 focus: bg-[#FFFFFF6B] sm:text-[15px]"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-[12px] mb-6">
              <Link href="/signup" className="font-light text-white hover:underline">
                新しくアカウントを作成する
              </Link>
              <Link href="/" className="font-light text-white hover:underline">
                パスワードをお忘れですか？
              </Link>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="text-white text-[20px] cursor-pointer px-4 py-2 bg-[#FFFFFF6B] opacity-100 rounded-md shadow-sm"
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="footer fixed bottom-0 left-0 w-full h-[100px] z-50 flex justify-center items-center mb-5">
          <Image src="/images/DATAMIND-AI.png" alt="logo" width={400} height={400} />
      </div>
    </div>
  );
} 