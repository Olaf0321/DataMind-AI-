'use client'
import Layout from "../../components/Layout";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AddTaskModal from '../../components/AddTaskModal';

interface TaskFormValues {
  taskName: string;
  taskDescription: string;
  databaseId: string;
}

interface Task {
  "id": number,
  "タスク名": string,
  "タスクの説明": string,
  "最終的に採用されたSelect文": string,
  "作成者": string,
  "作成日": string,
  "状態": string,
}

export default function TaskListPage() {
  const router = useRouter();
  const [realTaskList, setRealTaskList] = useState([]);
  const [DisplayTaskList, setDisplayTaskList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7); // default fallback
  const [selectedSearchMethodValue, setSelectedSearchMethodValue] = useState('1');
  const [inputSearchValue, setInputSearchValue] = useState('');
  const [selectedSearchValue, setSelectedSearchValue] = useState('0');
  const [taskList, setTaskList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchMethondList, setSearchMethodList] = useState(['全体', 'ID', 'タスク名', 'タスクの説明', '最終的に採用されたSelect文', '生成日', '生成者', '状態']);
  const [isLoading, setIsLoading] = useState(Boolean);
  const [isModalOpen, setIsModalOpen] = useState(Boolean);
  const [databaseList, setDatabaseList] = useState([]);
  const [userId, setUserId] = useState<number | -1>(-1);
  const [status, setStatus] = useState(['完了', '進行中']);

  const totalPages = useMemo(() => {
    return Math.ceil(DisplayTaskList.length / pageSize);
  }, [DisplayTaskList, pageSize]);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return DisplayTaskList.slice(startIndex, startIndex + pageSize);
  }, [DisplayTaskList, currentPage, pageSize]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const getTaskList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/task/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTaskList(data.tasks);
      data.tasks.sort((a: Task, b: Task) => new Date(b["作成日"]).getTime() - new Date(a["作成日"]).getTime());
      setRealTaskList(data.tasks);
      setDisplayTaskList(data.tasks);
    } catch (error) {
      console.error('Error fetching task list:', error);
    }
  }

  const getUserList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserList(data.users);
    } catch (error) {
      console.error('Error fetching artifact list:', error);
    }
  }

  const containsCheck = (obj: Task, search: string): boolean => {
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

  const addTask = async (data: TaskFormValues) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/task/`, {
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
      if (resdata.status === "タスクが正常に作成されました") {
        const taskInfo = resdata.task;
        localStorage.setItem('task', JSON.stringify({
          id: taskInfo['id'],
          taskName: taskInfo['タスク名'],
          taskDescription: taskInfo['タスクの説明'],
        }));
        localStorage.setItem('createSelect', 'YES');
        getTaskList();
      } else {
        alert('タスクの追加に失敗しました');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('タスクの追加に失敗しました');
    }
  }

  const getUserDatabaseList = async (userId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/database/list/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const resdata = await response.json();
      setDatabaseList(resdata);
    } catch (error) {
      console.error('Error fetching database list:', error);
      alert('データベースの取得に失敗しました');
    }
  }

  const onsubmit = async (data: TaskFormValues) => {
    try {
      if (data.taskName.trim() === '' || data.taskDescription.trim() === '') {
        alert('タスク名とタスクの説明は必須です。');
        setIsLoading(false);
        return;
      }
      if (data.databaseId === '-1') {
        alert('データベースを選択してください。');
        setIsLoading(false);
        return;
      }
      setIsModalOpen(false); // モーダルをすぐ閉じる
      localStorage.removeItem('task');
      localStorage.removeItem('selectedData');
      localStorage.removeItem('confirmData');
      localStorage.removeItem('createSelect');
      addTask(data);
      getUserDatabaseList(userId);
      router.push('/select-query');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('タスクの追加に失敗しました');
    }
  }

  const deleteTask = async (taskId: number) => {
    if (confirm('このタスクを削除しますか？')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/task/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const resdata = await response.json();
        if (resdata.status === "タスクが正常に削除されました") {
          getTaskList();
        } else {
          alert('タスクの削除に失敗しました');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('タスクの削除に失敗しました');
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      getTaskList();
      getUserList();
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = Number(JSON.parse(localStorage.getItem("user") || "{}").id);
      setUserId(id);
      getUserDatabaseList(id);
      getTaskList();
    }
  }, []);

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
    setSelectedSearchValue('0');
    if (selectedSearchMethodValue === '1' || selectedSearchMethodValue === '2' || selectedSearchMethodValue === '4' || selectedSearchMethodValue === '5' || selectedSearchMethodValue === '6') {
      setDisplayTaskList(realTaskList);
    } else if (selectedSearchMethodValue === '3') {
      setDisplayTaskList(realTaskList.filter(task => task["タスク名"] === taskList[0]["タスク名"]));
    } else if (selectedSearchMethodValue === '7') {
      setDisplayTaskList(realTaskList.filter(task => task["作成者"] === userList[0]["名前"]));
    } else if (selectedSearchMethodValue === '8') {
      setDisplayTaskList(realTaskList.filter(task => task["状態"] === status[0]));
    }
  }, [selectedSearchMethodValue]);

  useEffect(() => {
    if (selectedSearchMethodValue === '1') {
      setDisplayTaskList(realTaskList.filter(task => containsCheck(task, inputSearchValue)));
    } else if (selectedSearchMethodValue === '2') {
      setDisplayTaskList(realTaskList.filter(task => contains(task['id'], inputSearchValue)));
    } else if (selectedSearchMethodValue === '4') {
      setDisplayTaskList(realTaskList.filter(task => contains(task['タスクの説明'], inputSearchValue)));
    } else if (selectedSearchMethodValue === '5') {
      setDisplayTaskList(realTaskList.filter(task => contains(task['最終的に採用されたSelect文'], inputSearchValue)));
    } else if (selectedSearchMethodValue === '6') {
      setDisplayTaskList(realTaskList.filter(task => contains(task['作成日'], inputSearchValue)));
    }
  }, [inputSearchValue]);

  useEffect(() => {
    if (selectedSearchMethodValue === '3') {
      setDisplayTaskList(realTaskList.filter(task => task['タスク名'] === taskList[Number(selectedSearchValue)]['タスク名']));
    } else if (selectedSearchMethodValue === '7') {
      setDisplayTaskList(realTaskList.filter(task => task['作成者'] === userList[Number(selectedSearchValue)]['名前']));
    } else if (selectedSearchMethodValue === '8') {
      setDisplayTaskList(realTaskList.filter(task => task['状態'] === status[Number(selectedSearchValue)]));
    }
  }, [selectedSearchValue]);

  return (
    <Layout title="タスク一覧画面">
      <div className="flex justify-between items-center mb-8">
        <div className="add-task-button">
          {/* <Image src="/images/123.gif" alt="arrow-left" width={100} height={100} className="cursor-pointer" /> */}
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
              value={selectedSearchMethodValue}
              onChange={(e) => setSelectedSearchMethodValue(e.target.value)}
            >
              {searchMethondList.map((search, index) => (
                <option key={index} value={index + 1} className={`${index % 2 === 1 ? "bg-[#F1F1F1]" : ''}`}>
                  {search}
                </option>
              ))}
            </select>
          </div>
          <div className="search-task-input flex ml-4">
            {selectedSearchMethodValue === '1' || selectedSearchMethodValue === '2' || selectedSearchMethodValue === '4' || selectedSearchMethodValue === '5' || selectedSearchMethodValue === '6' ? (
              <input
                type="text"
                className="w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
                 focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
                value={inputSearchValue}
                onChange={(e) => setInputSearchValue(e.target.value)}
              />
            ) : selectedSearchMethodValue === '3' ? (
              <select
                className="cursor-pointer w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
                focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
                value={selectedSearchValue}
                onChange={(e) => setSelectedSearchValue(e.target.value)}
              >
                {taskList.length === 0 ? (
                  <option value="1" className="bg-[#F1F1F1]" disabled>
                    作成されたタスクはありません。
                  </option>
                ) : (
                  taskList.map((task, index) => (
                    <option key={index + 1} value={String(index)} className={`${index % 2 === 1 ? "bg-[#F1F1F1]" : ''}`}>
                      {task["タスク名"]}
                    </option>
                  ))
                )}
              </select>
            ) : selectedSearchMethodValue === '7' ? (
              <select
                className="cursor-pointer w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
                focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
                value={selectedSearchValue}
                onChange={(e) => setSelectedSearchValue(e.target.value)}
              >
                {userList.length === 0 ? (
                  <option value="1" className="bg-[#F1F1F1]" disabled>
                    登録されたユーザーがいません。
                  </option>
                ) : (
                  userList.map((user, index) => (
                    <option key={index + 1} value={String(index)} className={`${index % 2 === 1 ? "bg-[#F1F1F1]" : ''}`}>
                      {user["名前"]}
                    </option>
                  ))
                )}
              </select>
            ) : selectedSearchMethodValue === '8' ? (
              <select
                className="cursor-pointer w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
                focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
                value={selectedSearchValue}
                onChange={(e) => setSelectedSearchValue(e.target.value)}
              >(
                {status.map((stu, index) => (
                  <option key={index + 1} value={String(index)} className={`${index % 2 === 1 ? "bg-[#F1F1F1]" : ''}`}>{stu}</option>
                ))})
              </select>
            ) : null}
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
                  <th className="px-4 py-3 font-normal">タスク名</th>
                  <th className="px-4 py-3 font-normal">タスクの説明</th>
                  <th className="px-4 py-3 font-normal">最終的に採用されたSelect文</th>
                  <th className="px-4 py-3 font-normal">作成者</th>
                  <th className="px-4 py-3 font-normal">作成日</th>
                  <th className="px-4 py-3 font-normal">状態</th>
                  <th className="px-4 py-3 rounded-r-md font-normal">操作</th>
                </tr>
              </thead>
              <tbody className="text-sm mt-2 text-[#0E538C]">
                <tr>
                  <td colSpan={8} className="h-3"></td>
                </tr>
                {
                  paginatedTasks === undefined || paginatedTasks.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-[#737576]">
                        成果物がありません
                      </td>
                    </tr>
                  ) : null
                }
                {paginatedTasks !== undefined && paginatedTasks.length > 0 && paginatedTasks.map((task, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                    <td className={`px-4 py-6 ${index === 0 ? 'rounded-tl-md' : ''} ${index === paginatedTasks.length - 1 ? 'rounded-bl-md' : ''}`}>
                      {task["id"]}
                    </td>
                    <td className="px-4 py-3">{task["タスク名"]}</td>
                    <td className="px-4 py-3">{task["タスクの説明"]}</td>
                    <td className="px-4 py-3">{task["最終的に採用されたSelect文"]}</td>
                    <td className="px-4 py-3">{task["作成者"]}</td>
                    <td className="px-4 py-3">
                      {new Date(task["作成日"]).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{task["状態"]}</td>
                    <td className={`px-4 py-3 space-x-2 whitespace-nowrap text-center ${index === 0 ? 'rounded-tr-md' : ''} ${index === 8 ? 'rounded-br-md' : ''}`}>
                      <button className="bg-[#629986] text-white px-3 py-1.5 rounded cursor-pointer">コピー</button>
                      <button className="bg-[#0E538C] text-white px-3 py-1.5 rounded cursor-pointer">実行</button>
                      <button
                        className="bg-[#ED601E] text-white px-3 py-1.5 rounded cursor-pointer"
                        onClick={() => {
                          deleteTask(task['id']);
                        }}
                      >削除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-auto pt-4 space-x-2">
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
      </div>
      <AddTaskModal
        databaseList={databaseList}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onsubmit}
        userId={userId}
      />
    </Layout>
  );
}