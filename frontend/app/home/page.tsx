import Layout from "../../components/Layout";
import VideoPlayer from "../../components/VideoPlayer";
import Image from "next/image";

export default function BlankPage() {
  return (
    <Layout title="ホーム">
      <div className="relative w-full h-full">
        <VideoPlayer />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2/3 h-2/3 relative">
            <Image
              src="/images/ai-letter.png"
              alt="ai-letter"
              fill
              className="object-contain cursor-pointer"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
