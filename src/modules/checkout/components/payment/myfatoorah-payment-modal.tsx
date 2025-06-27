import React from "react";

interface IframeModalProps {
  url: string | null;
  onClose: () => void;
}

const MyFatoorahModal: React.FC<IframeModalProps> = ({ url, onClose }) => {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-11/12 md:w-3/4 lg:w-2/3 h-4/5 bg-white rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-red-600"
        >
          &times;
        </button>
        <iframe
          src={url}
          className="w-full h-full rounded-b-lg"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MyFatoorahModal;
