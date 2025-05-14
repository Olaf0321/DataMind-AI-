"use client";
import Image from "next/image";
import { FiMenu } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const initialMenuItems = [
  { label: "タスク一覧画面", icon: "/icons/menu-task-list.png", active: false, link: "/task-list" },
  { label: "SELECT文壁打ち画面", icon: "/icons/menu-select-query.png", active: false, link: "/select-query" },
  { label: "抽出結果表示画面", icon: "/icons/menu-result-display.png", active: false, link: "/result-display" },
  { label: "成果物壁打ち画面", icon: "/icons/menu-artifact-management.png", active: false, link: "/artifact-management" },
  { label: "成果物一覧画面", icon: "/icons/menu-artifact-list.png", active: false, link: "/artifact-list" },
  { label: "SELECT文プロンプト履歴一覧", icon: "/icons/menu-select-history.png", active: false, link: "/select-history" },
  { label: "成果物プロンプト履歴一覧", icon: "/icons/menu-artifact-history.png", active: false, link: "/artifact-history" },
];
interface SidebarProps {
  title: string;
}

export default function Sidebar({ title }: SidebarProps) {
  const router = useRouter();
  const role = JSON.parse(localStorage.getItem("user") || "{}").権限;

  const [menuItems, setMenuItems] = useState(initialMenuItems);

  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].label === title) {
      menuItems[i].active = true;
    } else {
      menuItems[i].active = false;
    }
  }

  useEffect(() => {
    if (role !== 'ユーザー') {
      setMenuItems([...menuItems, { label: "ユーザー管理", icon: "/icons/menu-user-management.png", active: false, link: "/user-management" },
      { label: "データベース管理", icon: "/icons/menu-user-management.png", active: false, link: "/database-management" }
      ]);
    }
  }, [role]);

  return (
    <aside className="w-72 bg-[#00306A] text-white flex flex-col relative min-h-screen">
      <div className="flex items-center h-16 px-3 border-b border-[#2e4066] relative">
        <Image src="/images/logo.png" alt="DATAMIND AI" className="cursor-pointer" width={140} height={36} />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-[#2e4066] lg:hidden">
          <FiMenu size={24} />
        </button>
      </div>
      <nav className="flex-1 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => router.push(item.link)}
                className={`w-full flex items-center px-6 py-3 text-sm font-medium rounded-l-full transition-colors cursor-pointer ${item.active
                  ? "bg-[#FB5B01] text-white"
                  : "hover:bg-[#2e4066] text-white"
                  }`}
              >
                <span className="mr-3">
                  <Image src={item.icon} alt={'x'} width={24} height={24} />
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}