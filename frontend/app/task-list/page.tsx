"use client";
import Layout from "../../components/Layout";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddTaskModal from '../../components/AddTaskModal';

interface TaskFormValues {
  taskName: string;
  taskDescription: string;
  databaseId: string;
}

export default function TaskListPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('1');
  const [databaseList, setDatabaseList] = useState([]);
  const [userId, setUserId] = useState<number | -1>(-1);

  const getUserDatabaseList = async (userId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/database/list/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const resdata = await response.json();
      console.log('Database list:', resdata);
      setDatabaseList(resdata);
    } catch (error) {
      console.error('Error fetching database list:', error);
      alert('データベースの取得に失敗しました');
    }
  }

  const onsubmit = async (data: TaskFormValues) => {
    console.log('Form submitted:', data);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/database/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          taskName: data.taskName,
          taskDescription: data.taskDescription,
          databaseId: data.databaseId,
          userId: userId,
        }),
      });
      const resdata = await response.json();
      console.log('Response data:', resdata);
      if (resdata.status === 'success') {
        alert('タスクが正常に追加されました');
        setIsModalOpen(false);
        getUserDatabaseList(userId);
      } 
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('タスクの追加に失敗しました');
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = Number(JSON.parse(localStorage.getItem("user") || "{}").id);
      console.log('User ID:', id);
      setUserId(id);
      getUserDatabaseList(id);
    }
  }, []);

  return (
    <Layout title="タスク一覧画面">
      <div className="flex justify-between items-center mb-8">
        <div className="add-task-button">
          <button
            className="bg-[#0E538C] text-white px-6 py-2 rounded-md cursor-pointer flex justify-between items-center w-24"
            onClick={() => setIsModalOpen(true)}
          >
            <span>追</span>
            <span>加</span>
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
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            >
              <option value="1" className="bg-[#F1F1F1]">全体</option>
              <option value="2">ID</option>
              <option value="3" className="bg-[#F1F1F1]">タスク名</option>
              <option value="4">タスクの説明</option>
              <option value="5" className="bg-[#F1F1F1]">Select文</option>
              <option value="6">作成者</option>
              <option value="7" className="bg-[#F1F1F1]">作成日</option>
            </select>
          </div>

          {filter !== '2' && filter !== '3' && filter !== '6' ? (
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
          ) : (
            <div className="search-task-input flex ml-4">
              <select
                className="cursor-pointer w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
               focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
              >
                <option value="1" className="bg-[#F1F1F1]">タスク1</option>
                <option value="2">タスク2</option>
                <option value="3" className="bg-[#F1F1F1]">タスク3</option>
                <option value="4">タスク4</option>
              </select>
              <label className="bg-[#ED601E] text-white px-4 py-2 border-[1px] border-[#ED601E] rounded-r-md flex justify-between items-center w-18">
                <span>選</span>
                <span>択</span>
              </label>
            </div>
          )}
        </div>
      </div>
      <div className="table-auto">
        <div className="flex flex-col h-[calc(100vh-350px)]">
          <div className="flex-grow overflow-hidden">
            <table className="w-full border-collapse text-center  overflow-x-auto">
              <thead className="bg-[#E5E5E5] text-[#4C4C4C] mb-2">
                <tr>
                  <th className="px-4 py-4 rounded-l-md font-normal">ID</th>
                  <th className="px-4 py-3 font-normal">タスク名</th>
                  <th className="px-4 py-3 font-normal">タスクの説明</th>
                  <th className="px-4 py-3 font-normal">最終的に採用されたSelect文</th>
                  <th className="px-4 py-3 font-normal">作成者</th>
                  <th className="px-4 py-3 font-normal">作成日</th>
                  <th className="px-4 py-3 font-normal">成果物</th>
                  <th className="px-4 py-3 font-normal">Select文生成プロンプト</th>
                  <th className="px-4 py-3 font-normal">成果物生成プロンプト</th>
                  <th className="px-4 py-3 rounded-r-md font-normal">操作</th>
                </tr>
              </thead>
              <tbody className="text-sm mt-2 text-[#0E538C]">
                <tr>
                  <td colSpan={10} className="h-3"></td>
                </tr>
                {[...Array(9)].map((_, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                    <td className={`px-4 py-6 ${i === 0 ? 'rounded-tl-md' : ''} ${i === 8 ? 'rounded-bl-md' : ''}`}>{i + 1}</td>
                    <td className="px-4 py-3">売上集計</td>
                    <td className="px-4 py-3">月別売上を集計する処理です</td>
                    <td className="px-4 py-3">SELECT * FROM Sales;</td>
                    <td className="px-4 py-3">User_001</td>
                    <td className="px-4 py-3 whitespace-nowrap">2025-05-05<br />09:15:42</td>

                    {/* 成果物 */}
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex justify-center space-x-1">
                        <span>成果物</span>
                        <a onClick={() => router.push('/artifact-list')} className="cursor-pointer">
                          <Image src="/images/go_link.png" alt="link" width={10} height={10} />
                        </a>
                      </div>
                    </td>

                    {/* Select文生成プロンプト */}
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex justify-center space-x-1">
                        <span>Select文生成プロンプト</span>
                        <a onClick={() => router.push('/select-history')} className="cursor-pointer">
                          <Image src="/images/go_link.png" alt="link" width={10} height={10} />
                        </a>
                      </div>
                    </td>

                    {/* 成果物生成プロンプト */}
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex justify-center space-x-1">
                        <span>成果物生成プロンプト</span>
                        <a onClick={() => router.push('/artifact-history')} className="cursor-pointer">
                          <Image src="/images/go_link.png" alt="link" width={10} height={10} />
                        </a>
                      </div>
                    </td>

                    {/* 操作 */}
                    <td className={`px-4 py-3 space-x-2 whitespace-nowrap text-center ${i === 0 ? 'rounded-tr-md' : ''} ${i === 8 ? 'rounded-br-md' : ''}`}>
                      <button className="bg-[#629986] text-white px-3 py-1.5 rounded cursor-pointer">コピー</button>
                      <button className="bg-[#0E538C] text-white px-3 py-1.5 rounded cursor-pointer">実行</button>
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
      <AddTaskModal
        databaseList={databaseList}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onsubmit}
      />
    </Layout>
  );
}