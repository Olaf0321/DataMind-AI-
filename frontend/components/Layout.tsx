import Sidebar from "./Sidebar";
import Header from "./Header";
import { ReactNode } from "react";

interface LayoutProps {
  title: string;
  children: ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar title={title} />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className={`flex-1 ${title !== 'ホーム' && 'px-8 py-4'} bg-white`}>{children}</main>
      </div>
    </div>
  );
} 