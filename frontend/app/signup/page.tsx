'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';

interface SignupForm {
  名前: string;
  メールアドレス: string;
  パスワード: string;
  パスワード確認: string;
  avatar?: FileList;
}

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupForm>();
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('名前', data.名前);
      formData.append('メールアドレス', data.メールアドレス);
      formData.append('パスワード', data.パスワード);
      formData.append('パスワード確認', data.パスワード確認);
      
      if (data.avatar?.[0]) {
        formData.append('avatar', data.avatar[0]);
      }

      await signup(formData);
      router.push('/task-list');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || '登録に失敗しました');
      } else {
        setError('登録に失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          アカウント作成
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="名前" className="block text-sm font-medium text-gray-700">
                名前
              </label>
              <div className="mt-1">
                <input
                  id="名前"
                  type="text"
                  {...register('名前', { required: '名前を入力してください' })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.名前 && (
                  <p className="mt-2 text-sm text-red-600">{errors.名前.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="メールアドレス" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  id="メールアドレス"
                  type="email"
                  {...register('メールアドレス', {
                    required: 'メールアドレスを入力してください',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: '有効なメールアドレスを入力してください',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.メールアドレス && (
                  <p className="mt-2 text-sm text-red-600">{errors.メールアドレス.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="パスワード" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="パスワード"
                  type="password"
                  {...register('パスワード', {
                    required: 'パスワードを入力してください',
                    minLength: {
                      value: 8,
                      message: 'パスワードは8文字以上で入力してください',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.パスワード && (
                  <p className="mt-2 text-sm text-red-600">{errors.パスワード.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="パスワード確認" className="block text-sm font-medium text-gray-700">
                パスワード確認
              </label>
              <div className="mt-1">
                <input
                  id="パスワード確認"
                  type="password"
                  {...register('パスワード確認', {
                    required: 'パスワード確認を入力してください',
                    validate: (value) =>
                      value === watch('パスワード') || 'パスワードが一致しません',
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.パスワード確認 && (
                  <p className="mt-2 text-sm text-red-600">{errors.パスワード確認.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                アバター画像
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="アバター"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  {...register('avatar')}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleAvatarChange(e);
                    register('avatar').onChange?.(e);
                  }}
                  ref={(e) => {
                    register('avatar').ref(e);
                    fileInputRef.current = e;
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  画像を選択
                </button>
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

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? '登録中...' : '登録'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  すでにアカウントをお持ちの方は
                  <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    ログイン
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 