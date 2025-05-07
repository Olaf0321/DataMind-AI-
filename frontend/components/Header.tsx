import Image from "next/image";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between h-16 px-8">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FaSearch size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FaBell size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiSettings size={18} />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <FaUserCircle size={32} />
          </button>
        </div>
      </div>
      {/* Info Card */}
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex-1">
          <div className="rounded-xl bg-gradient-to-r from-[#5b6ee1] to-[#ff7e5f] text-white shadow-lg flex items-center">
            <div className="flex-1 p-6">
              <div className="text-2xl font-semibold mb-2">各タスクの状態、登録内容、関連成果物などを一目で把握</div>
            </div>
            <div className="hidden md:block px-6">
              <Image src="/image-1.png" alt="dashboard" width={160.5} height={80} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 