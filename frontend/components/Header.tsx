"use client";

import Image from "next/image";
import { FaSearch, FaBell } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import UserModal from "./UserModal";

const Description = [
  { label: "タスク一覧画面", description: "各タスクの状態、登録内容、関連成果物などを一目で把握" },
  { label: "SELECT文壁打ち画面", description: "AIを活用して効率的にSELECT文を生成できる画面です。" },
  { label: "抽出結果表示画面", description: "生成されたSQLクエリで抽出したデータを表示します。" },
  { label: "成果物壁打ち画面", description: "抽出結果を基に、成果物を生成するためのプロンプトを作成します。" },
  { label: "成果物一覧画面", description: "タスクごとに生成済みの成果物を一覧表示します。" },
  { label: "SELECT文プロンプト履歴一覧", description: "過去に生成したSELECT文プロンプトを一覧で確認できます。" },
  { label: "成果物プロンプト履歴一覧", description: "これまでに作成した成果物生成プロンプトを一覧表示します。" },
  { label: "ユーザー管理", description: "ユーザー管理を通じて、効率的に権限とアカウントを管理しましょう。" },
  { label: "データベース管理", description: "データベース管理を通じて、効率的にデータベースを管理しましょう。" },
];
interface HeaderProps {
  title: string;
}

interface UserInfo {
  名前: string;
  メールアドレス: string;
  アバター?: string;
  権限?: string;
}

interface UpdateUserInfo {
  userName: string;
  email: string;
}

export default function Header({ title }: HeaderProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const updateUserInfo = async (data: UpdateUserInfo) => {
    alert('ookok');
    console.log('updateUserInfo', data);
    // try {
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //     },
    //     body: JSON.stringify({
    //       userName: updateUserInfo.userName,
    //       email: updateUserInfo.email
    //     }),
    //   });
    //   const resdata = await response.json();
    //   if (resdata.status === "タスクが正常に作成されました") {
    //     const taskInfo = resdata.task;
    //     localStorage.setItem('task', JSON.stringify({
    //       id: taskInfo['id'],
    //       taskName: taskInfo['タスク名'],
    //       taskDescription: taskInfo['タスクの説明'],
    //     }));
    //     localStorage.setItem('createSelect', 'YES');
    //     getTaskList();
    //   } else {
    //     alert('タスクの追加に失敗しました');
    //   }
    // } catch (error) {
    //   console.error('Error adding task:', error);
    //   alert('タスクの追加に失敗しました');
    // }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="bg-white">
      <div className="flex items-center justify-between h-16 px-8">
        <h1 className="text-xl">{title}</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <FaBell size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <FiSettings size={18} />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-1 w-12 h-12 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              {user?.アバター ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${user.アバター.replace(/^uploads\//, "")}`}
                  alt="avatar"
                  width={36}
                  height={36}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.5-1.8 4.5-4.5S14.7 3 12 3 7.5 4.8 7.5 7.5 9.3 12 12 12zm0 1.5c-3 0-9 1.5-9 4.5V21h18v-3c0-3-6-4.5-9-4.5z" fill="#888" />
                  </svg>
                </div>
              )}
            </button>
            {dropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-3 border-b focus:outline-none hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsChange(false);
                  }} // You can define this function as needed
                >
                  <div className="font-semibold text-gray-900">{user.名前}</div>
                  <div className="text-sm text-gray-500">{user.メールアドレス}</div>
                </button>
                <button
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 rounded-b-lg cursor-pointer"
                  onClick={handleLogout}
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Info Card */}
      <div className="flex justify-between px-8 py-6">
        <div className="flex-1">
          <div className="rounded-xl bg-gradient-to-r from-[#00306A] via-[#A77BB6] to-[#FB5B01] text-white shadow-lg flex items-center">
            <div className="flex-1 p-6">
              <div className="overflow-hidden w-full">
                <div className="inline-block whitespace-nowrap animate-marquee text-2xl font-semibold">
                  {
                    Description.find((item) => item.label === title)?.description
                  }
                </div>
              </div>
            </div>
            <div className="hidden md:block px-10 pt-2">
              <Image src="/images/header-image.png" alt="dashboard" width={160.5} height={80} />
            </div>
          </div>
        </div>
      </div>
      <UserModal
        isOpen={isModalOpen}
        isChange={isChange}
        onSubmit={(data) => {
          // setIsModalOpen(false);
          // updateTaskFinal();
          // router.push('/artifact-list');
          // localStorage.removeItem('task');
          // localStorage.removeItem('selectedData');
          // localStorage.removeItem('confirmData');
          // localStorage.removeItem('createSelect');
          updateUserInfo(data);
          setIsChange(false);
        }}
        onChange={() => {
          setIsChange(!isChange);
        }}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </header>
  );
} 