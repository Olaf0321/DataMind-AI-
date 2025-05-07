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
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-0 bg-white">{children}</main>
      </div>
    </div>
  );
} 