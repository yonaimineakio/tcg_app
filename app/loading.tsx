'use client';
import Image from "next/image";

export default function Loading() {
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* 後ほど画像（例：スピナー画像）に差し替え可能 */}
      <Image 
        src="/logo_project.png" 
        alt="Loading..." 
        width={128}
        height={128}
        className="w-32 h-32 object-contain" 
      />
    </div>
  );
}
