"use client";
import Image from "next/image";
import { FiMenu } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PiArrowCounterClockwiseLight } from "react-icons/pi";

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
  const [role, setRole] = useState("");
  const [taskInfo, setTaskInfo] = useState('');
  const [selectedData, setSelectedData] = useState('');

  const [menuItems, setMenuItems] = useState(initialMenuItems);


  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].label === title) {
      menuItems[i].active = true;
    } else {
      menuItems[i].active = false;
    }
  }

  const getTooltipMessage = (label: string): string => {
    switch (label.trim()) {
      case 'SELECT文壁打ち画面':
        return taskInfo === '' ? '現在作成されているタスクはありません。' : '';
      case '抽出結果表示画面':
        return selectedData === '' ? '現在抽出されたデータはありません。' : '';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (role === '管理者') {
      setMenuItems([...menuItems, { label: "ユーザー管理", icon: "/icons/menu-user-management.png", active: false, link: "/user-management" },
      { label: "データベース管理", icon: "/icons/menu-user-management.png", active: false, link: "/database-management" }
      ]);
    }
  }, [role]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const taskInfo1 = localStorage.getItem('task') || '';
      const selectedData1 = localStorage.getItem('selectedData') || '';
      setRole(user['権限'] || "");
      setTaskInfo(taskInfo1);
      setSelectedData(selectedData1);
    }
  }, []);

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
              <div
                className="relative w-full"
                onMouseEnter={() => {
                  if (item.label === 'SELECT文壁打ち画面' && taskInfo === '') {
                    setTooltipMessage('現在作成されているタスクはありません。');
                    setTooltipVisible(true);
                  } else if (item.label === '抽出結果表示画面' && selectedData === '') {
                    setTooltipMessage('現在抽出されたデータはありません。');
                    setTooltipVisible(true);
                  }
                }}
                onMouseLeave={() => {
                  setTooltipVisible(false);
                  setTooltipMessage('');
                }}
                onMouseMove={handleMouseMove}
              >
                {/* Tooltip (positioned under the cursor) */}
                {tooltipVisible && tooltipMessage && (
                  <div
                    className="fixed z-50 bg-gray-800 text-white text-sm font-medium px-3 py-1 rounded shadow-md pointer-events-none"
                    style={{
                      top: tooltipPosition.y + 12,
                      left: tooltipPosition.x + 12,
                    }}
                  >
                    {tooltipMessage}
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={() => router.push(item.link)}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium rounded-l-full transition-colors
                    ${item.active ? 'bg-[#FB5B01] text-white' : 'hover:bg-[#2e4066] text-white'}
                    ${item.label === 'SELECT文壁打ち画面' && taskInfo === '' ||
                      item.label === '抽出結果表示画面' && selectedData === ''
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'}
    `}
                  disabled={
                    item.label === 'SELECT文壁打ち画面' && taskInfo === '' ||
                    item.label === '抽出結果表示画面' && selectedData === ''
                  }
                >
                  <span className="mr-3">
                    <Image src={item.icon} alt="x" width={24} height={24} />
                  </span>
                  {item.label}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside >
  );
}