import React from "react";

interface ModalProps {
  isOpen: boolean; // モーダルが開いているかどうか
  onClose: () => void; // モーダルを閉じる関数
  children: React.ReactNode; // モーダル内のコンテンツ
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // isOpen が false なら何も表示しない

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-lg relative">
        {/* 閉じるボタン */}
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
