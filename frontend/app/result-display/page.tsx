'use client'
import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import { useRouter } from 'next/navigation';
import ConfirmDataModal from "../../components/ConfirmDataModal";

interface TaskModel {
  id: number;
  taskName: string;
  taskDescription: string;
}

export default function ResultDisplayPage() {
  const router = useRouter();
  const [task, setTask] = useState<TaskModel | null>(null);
  const [filter, setFilter] = useState('1');
  const [selectedData, setSelectedData] = useState<[] | null>(null);
  const [keyValue, setKeyValue] = useState<string[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState('');
  const [disabledStatus, setDisabledStatus] = useState('False');

  const getFinalSelect = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/selectPrompt/${task['id']}/final`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      return data.selectPrompt;
    } catch (error) {
      console.error('Error fetching select list:', error);
    }
  }

  const updateTaskSelect = async () => {
    try {
      const select1 = await getFinalSelect();
      console.log('select1', select1);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/task/${task['id']}/select`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          select: select1['プロンプト']
        }),
      });
      const data = await response.json();
      console.log('result', data.status);
    } catch (error) {
      console.error('Error fetching select list:', error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const selectedData = localStorage.getItem('selectedData');
    const taskInfo = localStorage.getItem('task') || null;
    if (!selectedData || selectedData === 'undefined') {
      router.push('/task-list');
    } else if (!token) {
      router.push('/login');
    } else {
      const jsonValue = JSON.parse(selectedData);
      setTask(JSON.parse(taskInfo || '{}'));
      setSelectedData(jsonValue);
      const keys = [];

      for (const [key, value] of Object.entries(jsonValue[0])) {
        keys.push(key);
      }
      setKeyValue(keys);
    }
  }, [router]);

  useEffect(() => {
    if (confirmData === 'YES') setDisabledStatus('TRUE');
  }, [confirmData])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('confirmData') || '';
      setConfirmData(stored);
    }
  }, []);

  return (
    <Layout title="抽出結果表示画面">
      <div className="flex justify-end items-center mb-8">
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
              {keyValue && keyValue.map((key, index) => (
                <option key={index} value={index + 1} className={index % 2 === 0 ? 'bg-[#F1F1F1]' : ''}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="table-auto">
        <div className="flex flex-col h-[calc(100vh-350px)]">
          <div className="flex-grow overflow-y-auto">
            <table className="w-full border-collapse text-center">
              <thead className="bg-[#E5E5E5] text-[#4C4C4C] mb-2">
                <tr>
                  {keyValue && keyValue.map((key, index) => (
                    <th key={index} className={`px-4 py-3 font-normal ${index === 0 ? 'rounded-tl-md' : ''} ${index === keyValue.length - 1 ? 'rounded-tr-md' : ''}`}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm mt-2 text-[#0E538C]">
                <tr>
                  <td colSpan={8} className="h-3"></td>
                </tr>
                {selectedData && selectedData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-4">
                      データがありません
                    </td>
                  </tr>
                )}
                {selectedData && selectedData.length > 0 && selectedData.map((data, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                    {Object.values(data).map((val, i) => (
                      <td key={i} className={`px-4 py-3 ${i === 0 ? 'rounded-tl-md' : ''} ${i === Object.keys(data).length - 1 ? 'rounded-tr-md' : ''}`}>
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-auto pt-4 space-x-2">
            <button
              className={`bg-[#0E538C] text-white rounded-md px-4 py-2 mr-4 flex items-center ${disabledStatus === 'TRUE' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={disabledStatus}
              onClick={() => router.push('/select-query')}
            >
              再実行
            </button>
            <button
              className={`bg-[#FB5B01] text-white rounded-md px-4 py-2 mr-4 flex items-center ${disabledStatus === 'TRUE' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={disabledStatus}
              onClick={() => { setIsModalOpen(true); }}
            >
              成果物生成
            </button>
          </div>
        </div>
        <ConfirmDataModal
          isOpen={isModalOpen}
          onConfirm={() => {
            setIsModalOpen(false);
            setConfirmData('YES');
            localStorage.setItem('confirmData', 'YES');
            localStorage.removeItem('createSelect');
            updateTaskSelect();
            router.push('/artifact-management');
          }}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      </div>
    </Layout>
  );
}