import Image from "next/image";
import { FiMenu } from "react-icons/fi";

const menuItems = [
  { label: "タスク一覧画面", icon: "/icons/menu-task.svg", active: false },
  { label: "SELECT文壁打ち画面", icon: "/icons/menu-select.svg", active: true },
  { label: "抽出結果表示画面", icon: "/icons/menu-result.svg", active: false },
  { label: "成果物管理打ち画面", icon: "/icons/menu-artifact.svg", active: false },
  { label: "成果物一覧画面", icon: "/icons/menu-artifact-list.svg", active: false },
  { label: "SELECT文フロント履歴一覧", icon: "/icons/menu-history.svg", active: false },
  { label: "成果物フロント履歴一覧", icon: "/icons/menu-artifact-history.svg", active: false },
];

export default function Sidebar() {
  return (
    <aside className="w-68 bg-[#223055] text-white flex flex-col relative min-h-screen">
      <div className="flex items-center h-16 px-6 border-b border-[#2e4066] relative">
        <Image src="/logo.png" alt="DATAMIND AI" width={36} height={36} />
        <span className="ml-3 font-bold text-lg tracking-wide">DATAMIND AI</span>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-[#2e4066] lg:hidden">
          <FiMenu size={24} />
        </button>
      </div>
      <nav className="flex-1 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={`flex items-center px-6 py-3 text-sm font-medium rounded-l-full transition-colors ${
                  item.active
                    ? "bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] text-white"
                    : "hover:bg-[#2e4066] text-[#bfc9e0]"
                }`}
              >
                <span className="mr-3">
                  {/* Replace with actual icons if available */}
                  <span className="inline-block w-5 h-5 bg-white/10 rounded-full" />
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 