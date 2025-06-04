"use client";
import Layout from "../../components/Layout";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DatabaseModal from "../../components/DatabaseModal";

interface DatabaseFormValues {
  'タイプ': string;
  'ホスト': string;
  'ポート': string;
  'データベース名': string;
  '接続ID': string;
  'パスワード': string;
  'ファイルパス': string;
  'ユーザーID': number;
}

const initialFormValues: DatabaseFormValues = {
  'タイプ': 'MySQL',
  'ホスト': '',
  'ポート': '',
  'データベース名': '',
  '接続ID': '',
  'パスワード': '',
  'ファイルパス': '',
  'ユーザーID': -1,
};


export default function DatabaseManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [databaseList, setDatabaseList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseFormValues>(initialFormValues);
  const [clickbutton, setClickButton] = useState(false);

  const router = useRouter();

  const getDatabaseList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/database/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const resdata = await response.json();
      console.log('resdata', resdata);
      setDatabaseList(resdata);
    } catch (error) {
      console.error('Error fetching database list:', error);
      alert('データベースの取得に失敗しました');
    }
  }

  const getUserList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const resdata = await response.json();
      setUserList(resdata.users);
    } catch (error) {
      console.error('Error fetching user list:', error);
      alert('ユーザーの取得に失敗しました');
    }
  }

  const deleteDatabase = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/database/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const resdata = await response.json();
      if (resdata.id !== undefined) {
        alert('データベースが正常に削除されました');
        getDatabaseList();
      } else {
        alert('データベースの削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting database:', error);
      alert('データベースの削除に失敗しました');
    }
  }

  const submitDatabase = async (data: DatabaseFormValues) => {
    try {
      if (selectedId === -1) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/database/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const resdata = await response.json();
        if (resdata.id !== undefined) {
          getDatabaseList();
          setIsModalOpen(false);
        } else {
          alert('データベースの登録に失敗しました');
        }
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/database/${selectedId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const resdata = await response.json();
        if (resdata.id !== undefined) {
          getDatabaseList();
          setIsModalOpen(false);
        } else {
          alert('データベースの編集に失敗しました。');
        }
      }
    } catch (error) {
      console.error('Error submitting database:', error);
      alert('データベース操作に失敗しました。');
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (selectedId !== -1) {
      const value = databaseList.find((database: any) => database['id'] === selectedId);
      if (value) {
        const value2 = {
          'タイプ': value['タイプ'],
          'ホスト': value['ホスト'],
          'ポート': value['ポート'],
          'データベース名': value['データベース名'],
          '接続ID': value['接続ID'],
          'パスワード': value['パスワード'],
          'ファイルパス': value['ファイルパス'],
          'ユーザーID': value['ユーザーID'],
        };
        setSelectedDatabase({...value2});
      }
    } else {
      setSelectedDatabase({...initialFormValues});
    }
  }, [selectedId, clickbutton]);

  useEffect(() => {
    getDatabaseList();
    getUserList();
  }, []);

  return (
    <Layout title="データベース管理">
      <div className="flex justify-between items-center mb-8">
        <div className="add-task-button">
          <button
            className="bg-[#0E538C] text-white px-6 py-2 rounded-md cursor-pointer flex justify-between items-center"
            onClick={() => {
              setSelectedId(-1);
              setClickButton(!clickbutton);
              setIsModalOpen(true);
            }}
          >
            <span>新規データベース作成</span>
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
                  <th className="px-4 py-3 font-normal">データベースタイプ</th>
                  <th className="px-4 py-3 font-normal">ホスト</th>
                  <th className="px-4 py-3 font-normal">ポート</th>
                  <th className="px-4 py-3 font-normal">データベース名</th>
                  <th className="px-4 py-3 font-normal">接続ID</th>
                  <th className="px-4 py-3 font-normal">パスワード</th>
                  <th className="px-4 py-3 font-normal">ファイルパス</th>
                  <th className="px-4 py-3 font-normal">ユーザーID</th>
                  <th className="px-4 py-3 rounded-r-md font-normal">アクション</th>
                </tr>
              </thead>
              <tbody className="text-sm mt-2 text-[#0E538C]">
                <tr>
                  <td colSpan={7} className="h-3"></td>
                </tr>

                {databaseList.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center text-[#737576] py-4">
                      <span className="text-[#737576] text-[20px]">データベースが見つかりませんでした。</span>
                    </td>
                  </tr>
                )}
                {databaseList.length > 0 && databaseList.map((database, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                    <td className={`px-4 py-6 ${index === 0 ? 'rounded-tl-md' : ''} ${index === databaseList.length - 1 ? 'rounded-bl-md' : ''}`}>{database['id']}</td>
                    <td className="px-4 py-3">{database['タイプ']}</td>
                    <td className="px-4 py-3">{database['ホスト']}</td>
                    <td className="px-4 py-3">{database['ポート']}</td>
                    <td className="px-4 py-3">{database['データベース名']}</td>
                    <td className="px-4 py-3">{database['接続ID']}</td>
                    <td className="px-4 py-3">{database['パスワード']}</td>
                    <td className="px-4 py-3">{database['ファイルパス']}</td>
                    <td className="px-4 py-3">{database['ユーザーID']}</td>
                    <td className={`px-4 py-3 space-x-2 whitespace-nowrap ${index === 0 ? 'rounded-tr-md' : ''} ${index === databaseList.length - 1 ? 'rounded-br-md' : ''}`}>
                      <button
                        className="bg-[#0E538C] text-white px-3 py-1.5 rounded cursor-pointer"
                        onClick={() => {
                          setSelectedId(database['id']);
                          setClickButton(!clickbutton);
                          setIsModalOpen(true);
                        }}
                      >編集</button>
                      <button
                        className="bg-[#ED601E] text-white px-3 py-1.5 rounded cursor-pointer"
                        onClick={() => {
                          deleteDatabase(database['id']);
                        }}
                      >
                        削除
                      </button>
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
      <DatabaseModal
        selectedId={selectedId}
        selectedDatabase={selectedDatabase}
        userList={userList}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitDatabase}
      />
    </Layout>
  );
}