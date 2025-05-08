import Layout from "../../components/Layout";

export default function TaskListPage() {
  return (
    <Layout title="タスク一覧画面">
      <div className="flex justify-between items-center mb-8">
        <div className="add-task-button">
          <button className="bg-[#243A73] text-white px-6 py-2 rounded-md cursor-pointer flex justify-between items-center w-24">
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
            >
              <option value="1">全体</option>
              <option value="2">作成日</option>
            </select>
          </div>
          <div className="search-task-input flex ml-4">
            <input
              type="text"
              className="w-32 bg-[#F5F5F5] border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
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
        <table className="w-full border-collapse text-center">
          <thead className="bg-[#E5E5E5] text-[#4C4C4C] mb-2">
            <tr>
              <th className="px-4 py-4 rounded-l-md font-normal">ID</th>
              <th className="px-4 py-3 font-normal">タスク名</th>
              <th className="px-4 py-3 font-normal">タスクの説明</th>
              <th className="px-4 py-3 font-normal">最終的に採用されたSelect文</th>
              <th className="px-4 py-3 font-normal">作成者</th>
              <th className="px-4 py-3 font-normal">作成日</th>
              <th className="px-4 py-3  rounded-r-md font-normal">操作</th>
            </tr>
          </thead>
          <tbody className="text-sm mt-2 text-[#0E538C]">
            <tr>
              <td colSpan={7} className="h-3"></td>
            </tr>
            {[...Array(10)].map((_, i) => (
              <tr key={i} className= {i % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                <td className={`px-4 py-3 ${i === 0 ? 'rounded-tl-md' : ''} ${i === 9 ? 'rounded-bl-md' : ''}`}>{i + 1}</td>
                <td className="px-4 py-3">売上集計</td>
                <td className="px-4 py-3">月別売上を集計する処理です</td>
                <td className="px-4 py-3">SELECT * FROM Sales;</td>
                <td className="px-4 py-3">User_001</td>
                <td className="px-4 py-3 whitespace-nowrap">2025-05-05<br />09:15:42</td>
                <td className={`px-4 py-3 space-x-2 whitespace-nowrap ${i === 0 ? 'rounded-tr-md' : ''} ${i === 9 ? 'rounded-br-md' : ''}`}>
                  <button className="bg-[#629986] text-white px-3 py-1.5 rounded cursor-pointer">コピー</button>
                  <button className="bg-[#0E538C] text-white px-3 py-1.5 rounded cursor-pointer">実行</button>
                  <button className="bg-[#ED601E] text-white px-3 py-1.5 rounded cursor-pointer">削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}