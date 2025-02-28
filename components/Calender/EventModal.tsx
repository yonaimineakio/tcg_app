import React from "react";
import { CalendarEvent } from "@/lib/definitions";

interface ModalProps {
  isOpen: boolean; // モーダルが開いているかどうか
  onClose: () => void; // モーダルを閉じる関数
  calenderEvent: CalendarEvent | null;
  children?: React.ReactNode;
}

const EventModal: React.FC<ModalProps> = ({ isOpen, onClose, calenderEvent, children}) => {
  if (!isOpen) return null; // isOpen が false なら何も表示しない

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-5 rounded-lg shadow-lg relative z-50">
          {/* 閉じるボタン */}
          <button className="absolute top-2 right-2 text-gray-500 z-50" onClick={onClose}>
            ✖
          </button>
          { calenderEvent && calenderEvent.title}
          {children}
        </div>
      </div>
  );
};

export default EventModal;
