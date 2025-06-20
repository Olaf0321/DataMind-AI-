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
      router.push('/home');
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
    <div className="h-screen w-screen bg-cover bg-center bg-no-repeat bg-[url('/images/top.png')] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="header fixed top-0 left-0 w-full h-[100px] z-50 flex justify-start items-center px-10 mt-5">
        <Image src="/images/Vector.png" className='mr-3 mt-2' alt="logo" width={70} height={70} />
        <Image src="/images/CLOUD-SHIFT.png" alt="logo" width={350} height={350} />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <div className="bg-[#0E538CB0] opacity-100 pt-35 pb-6 px-4 shadow sm:rounded-2xl sm:px-8 relative">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="名前" className="block text-[15px] text-white">
                ユーザー名
              </label>
              <div className="mt-1">
                <input
                  id="名前"
                  type="text"
                  {...register('名前', { required: '名前を入力してください' })}
                  className="appearance-none block w-full px-3 py-2 bg-[#FFFFFF6B] opacity-100 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-0 focus: bg-[#FFFFFF6B] sm:text-[15px]"
                />
                {errors.名前 && (
                  <p className="mt-2 text-sm text-red-600">{errors.名前.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-3">
              <label htmlFor="メールアドレス" className="block text-[15px] text-white">
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
                  className="appearance-none block w-full px-3 py-2 bg-[#FFFFFF6B] opacity-100 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-0 focus: bg-[#FFFFFF6B] sm:text-[15px]"
                />
                {errors.メールアドレス && (
                  <p className="mt-2 text-sm text-red-600">{errors.メールアドレス.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-3">
              <label htmlFor="パスワード" className="block text-[15px] text-white">
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
                  className="appearance-none block w-full px-3 py-2 bg-[#FFFFFF6B] opacity-100 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-0 focus: bg-[#FFFFFF6B] sm:text-[15px]"
                />
                {errors.パスワード && (
                  <p className="mt-2 text-sm text-red-600">{errors.パスワード.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-3">
              <label htmlFor="パスワード確認" className="block text-[15px] text-white">
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
                  className="appearance-none block w-full px-3 py-2 bg-[#FFFFFF6B] opacity-100 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-0 focus: bg-[#FFFFFF6B] sm:text-[15px]"
                />
                {errors.パスワード確認 && (
                  <p className="mt-2 text-sm text-red-600">{errors.パスワード確認.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-center absolute top-[-85px] left-[50%] translate-x-[-50%] items-center mb-3 ml-2">
              <div className="mt-1 flex items-center space-x-4">
                <label htmlFor="avatar" className='avatar'>
                  <div className="relative h-40 w-40 overflow-hidden flex items-center justify-center text-gray-400 bg-transparent opacity-100 cursor-pointer">
                    <div
                      className="w-40 aspect-[1/1] bg-white text-xl text-white shadow-md flex items-center justify-center 
               [clip-path:polygon(50%_0%,93%_25%,93%_75%,50%_100%,7%_75%,7%_25%)] 
               transition-all duration-300"
                      style={{ borderRadius: '8px' }}
                    >
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="アバター"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className='cursor-pointer'>
                          <Image src="/images/logo(1).png" alt="アバター" width={160} height={160} />
                        </div>
                      )}
                    </div>
                  </div>
                </label>
                <input
                  id="avatar"
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
                  className="hidden px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

            <div className="flex justify-center items-center text-[12px] mb-6">
              <span className='text-white mr-5'>
                既にアカウントをお持ちの方はこちら
              </span>
              <Link href="/login" className=" text-[14px] font-light text-white hover:underline">
                ログイン
              </Link>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="text-white text-[20px] cursor-pointer px-4 py-2 bg-[#FFFFFF6B] opacity-100 rounded-md shadow-sm"
              >
                {isLoading ? '登録中...' : '登 録'}
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