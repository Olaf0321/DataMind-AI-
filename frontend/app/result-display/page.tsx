'use client'
import { useEffect, useState, useMemo } from "react";

import Layout from "../../components/Layout";
import { useRouter } from 'next/navigation';
import ConfirmDataModal from "../../components/ConfirmDataModal";
import Image from "next/image";

interface TaskModel {
  id: number;
  taskName: string;
  taskDescription: string;
}

export default function ResultDisplayPage() {
  const router = useRouter();
  const [task, setTask] = useState<TaskModel | null>(null);
  const [localSelectedData, setLocalSelectedData] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [realSelectedData, setRealSelectedData] = useState<any[]>([]);
  const [keyValue, setKeyValue] = useState(['']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState('');
  const [disabledStatus, setDisabledStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7); // default fallback
  const [selectedSearchMethodValue, setSelectedSearchMethodValue] = useState('1');
  const [inputSearchValue, setInputSearchValue] = useState('');
  const [searchMethodList, setSearchMethodList] = useState(['']);

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
          select: select1['SELECT文']
        }),
      });
      const data = await response.json();
      console.log('result', data.status);
    } catch (error) {
      console.error('Error fetching select list:', error);
    }
  }

  const totalPages = useMemo(() => {
    return Math.ceil(selectedData.length / pageSize);
  }, [selectedData, pageSize]);

  const paginatedSelectedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return selectedData.slice(startIndex, startIndex + pageSize);
  }, [selectedData, currentPage, pageSize]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const containsCheck = (obj: any, search: string): boolean => {
    let str = '';
    Object.entries(obj).map(([key, value]) => {
      str += value;
    });
    return str.includes(search);
  };

  const contains = (text: string, search: string): boolean => {
    const str = String(text);
    return str.includes(search);
  };

  useEffect(() => {
    if (confirmData === 'YES') setDisabledStatus(true);
  }, [confirmData])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('confirmData') || '';
      setConfirmData(stored);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const selectedData1 = localStorage.getItem('selectedData');
    const taskInfo = localStorage.getItem('task') || null;
    if (!selectedData1 || selectedData1 === 'undefined') {
      router.push('/task-list');
    } else if (!token) {
      router.push('/login');
    } else {
      const jsonValue = JSON.parse(selectedData1);
      console.log('jsonValue', jsonValue);
      setLocalSelectedData(jsonValue);
      setTask(JSON.parse(taskInfo || '{}'));
      const keys = [];

      for (const [key, value] of Object.entries(jsonValue[0])) {
        keys.push(key);
      }
      setKeyValue(keys);
      setSearchMethodList(['全体', ...keys]);
    }
  }, [router]);

  useEffect(() => {
    setSelectedData(localSelectedData);
    setRealSelectedData(localSelectedData);
  }, [localSelectedData])

  useEffect(() => {
    const calculatePageSize = () => {
      const vh = window.innerHeight;
      const availableHeight = vh - 350; // corresponds to calc(100vh - 350px)
      const estimatedRowHeight = 70;
      const rows = Math.floor(availableHeight / estimatedRowHeight) - 1;
      const newPageSize = rows > 0 ? rows : 1;

      // 必要なときだけ状態を更新（レンダリング抑制）
      setPageSize(prev => {
        if (prev !== newPageSize) return newPageSize;
        return prev;
      });
    };

    calculatePageSize(); // 初回
    window.addEventListener('resize', calculatePageSize);

    return () => {
      window.removeEventListener('resize', calculatePageSize);
    };
  }, []);

  useEffect(() => {
    setInputSearchValue('');
    setSelectedData(realSelectedData);
  }, [selectedSearchMethodValue]);

  useEffect(() => {
    if (selectedSearchMethodValue === '1') {
      setSelectedData(realSelectedData.filter(data => containsCheck(data, inputSearchValue)));
    } else {
      setSelectedData(realSelectedData.filter(data => contains(data[searchMethodList[Number(selectedSearchMethodValue) - 1]], inputSearchValue)));
    }
  }, [inputSearchValue]);

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
              value={selectedSearchMethodValue}
              onChange={(e) => setSelectedSearchMethodValue(e.target.value)}
            >
              {searchMethodList && searchMethodList.map((key, index) => (
                <option key={index} value={index + 1} className={index % 2 === 0 ? 'bg-[#F1F1F1]' : ''}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div className="search-task-input flex ml-4">
            <input
              type="text"
              className="w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
                 focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
              value={inputSearchValue}
              onChange={(e) => setInputSearchValue(e.target.value)}
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
          <div className="flex-grow overflow-y-auto">
            <table className="w-full border-collapse text-center">
              <thead className="bg-[#E5E5E5] text-[#4C4C4C] mb-2">
                <tr>
                  {keyValue && keyValue.map((key, index) => (
                    <th key={index} className={`px-4 py-4 font-normal ${index === 0 ? 'rounded-l-md' : ''} ${index === keyValue.length - 1 ? 'rounded-r-md' : ''}`}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm mt-2 text-[#0E538C]">
                <tr>
                  <td colSpan={keyValue.length} className="h-3"></td>
                </tr>
                {paginatedSelectedData && paginatedSelectedData.length === 0 && (
                  <tr>
                    <td colSpan={keyValue.length} className="px-4 py-6 text-center text-[#737576]">
                      データがありません
                    </td>
                  </tr>
                )}
                {paginatedSelectedData && paginatedSelectedData.length > 0 && paginatedSelectedData.map((data, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                    {Object.values(data).map((val, i) => (
                      <td key={i} className={`px-4 py-6 ${index === 0 ? 'rounded-tl-md' : ''} ${index === paginatedSelectedData.length - 1 ? 'rounded-bl-md' : ''}`}>
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
              className={`bg-[#0E538C] text-white rounded-md px-4 py-2 mr-4 flex items-center ${disabledStatus === true ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={disabledStatus}
              onClick={() => router.push('/select-query')}
            >
              再実行
            </button>
            <button
              className={`bg-[#FB5B01] text-white rounded-md px-4 py-2 mr-8 flex items-center ${disabledStatus === true ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={disabledStatus}
              onClick={() => { setIsModalOpen(true); }}
            >
              成果物生成
            </button>
            <span className="text-[#737576] mr-4">前へ</span>
            <button
              className="px-2 py-1 mr-4"
              onClick={handlePrevPage}
            >
              <Image src="/images/arrow-left.png" alt="arrow-left" width={10} height={10} className="cursor-pointer" />
            </button>
            <span className="text-[#737576] mr-4">
              <span className="text-[#737576] w-4 bg-[#F5F5F5]">{currentPage}</span>
              <span className="text-[#737576] w-2">/</span>
              <span className="text-[#737576] w-4">{totalPages}</span>
            </span>
            <button
              className="px-2 py-1 mr-4"
              onClick={handleNextPage}
            >
              <Image src="/images/arrow-right.png" alt="arrow-right" width={10} height={10} className="cursor-pointer" />
            </button>
            <span className="text-[#737576]">次へ</span>
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
