"use client";
import Layout from "../../components/Layout";
import Image from "next/image";
import { useEffect, useState } from 'react';
import AddUserModal from '../../components/AddUserModal';
import { useRouter } from 'next/navigation';

export default function TaskListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const submitUser = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const getUserList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <Layout title="ユーザー管理">
      <div className="flex justify-between items-center mb-8">
        <div className="add-task-button">
          <button
            className="bg-[#0E538C] text-white px-6 py-2 rounded-md cursor-pointer flex justify-between items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <span>新規ユーザー登録</span>
          </button>
        </div>
        <div className="search-task-button filter-task-button flex items-center">
          <div className="filter-task-button-label flex">
            <label className="bg-[#ED601E] text-white px-4 py-2 border-[1px] border-[#ED601E] rounded-l-md">
              検索方式
            </label>
            <select
              className="bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-r-md cursor-pointer 
               focus:outline-none focus:border-[#ED601E] focus:rounded-r-md"
            >
              <option value="1">全体</option>
              <option value="2">ID</option>
              <option value="3">ユーザー名</option>
              <option value="4">メールアドレス</option>
              <option value="5">登録日</option>
              <option value="6">最終ログイン</option>
            </select>

          </div>
          <div className="search-task-input flex ml-4">
            <input
              type="text"
              className="w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
               focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
            />
            <label className="bg-[#ED601E] text-white px-4 py-2 border-[1px] border-[#ED601E] rounded-r-md flex justify-between items-center w-18">
              <span>検</span>
              <span>索</span>
            </label>
          </div>

        </div>
      </div>
      <div className="table-auto">
        <div className="flex flex-col h-[calc(100vh-350px)]">
          <div className="flex-grow overflow-hidden">
            <table className="w-full border-collapse text-center">
              <thead className="bg-[#E5E5E5] text-[#4C4C4C] mb-2">
                <tr>
                  <th className="px-4 py-4 rounded-l-md font-normal">ID</th>
                  <th className="px-4 py-3 font-normal">ユーザー名</th>
                  <th className="px-4 py-3 font-normal">メールアドレス</th>
                  <th className="px-4 py-3 font-normal">登録日</th>
                  <th className="px-4 py-3 font-normal">最終ログイン</th>
                  <th className="px-4 py-3 rounded-r-md font-normal">アクション</th>
                </tr>
              </thead>
              <tbody className="text-sm mt-2 text-[#0E538C]">
                <tr>
                  <td colSpan={7} className="h-3"></td>
                </tr>
                {[...Array(9)].map((_, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                    <td className={`px-4 py-6 ${i === 0 ? 'rounded-tl-md' : ''} ${i === 8 ? 'rounded-bl-md' : ''}`}>{i + 1}</td>
                    <td className="px-4 py-3">山田太郎</td>
                    <td className="px-4 py-3">yamada@abc.com</td>
                    <td className="px-4 py-3">2025-05-01</td>
                    <td className="px-4 py-3">2025-05-10</td>
                    <td className={`px-4 py-3 space-x-2 whitespace-nowrap ${i === 0 ? 'rounded-tr-md' : ''} ${i === 8 ? 'rounded-br-md' : ''}`}>
                      <button className="bg-[#0E538C] text-white px-3 py-1.5 rounded cursor-pointer">編集</button>
                      <button className="bg-[#ED601E] text-white px-3 py-1.5 rounded cursor-pointer">削除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-auto pt-4 space-x-2">
            <span className="text-[#737576] mr-4">前へ</span>
            <button className="px-2 py-1 mr-4">
              <Image src="/images/arrow-left.png" alt="arrow-left" width={10} height={10} className="cursor-pointer" />
            </button>
            <span className="text-[#737576] mr-4">
              <span className="text-[#737576] w-4 bg-[#F5F5F5]">1</span>
              <span className="text-[#737576] w-2">/</span>
              <span className="text-[#737576] w-4">1</span>
            </span>
            <button className="px-2 py-1 mr-4">
              <Image src="/images/arrow-right.png" alt="arrow-right" width={10} height={10} className="cursor-pointer" />
            </button>
            <span className="text-[#737576]">次へ</span>
          </div>
        </div>
      </div>
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => submitUser()}
      />
    </Layout>
  );
}