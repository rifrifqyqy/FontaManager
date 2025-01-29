interface ModalProps {
  message: string;
  onClose: () => void;
}

const Modal = ({ message, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50">
      {/* Modal Box */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        {/* Close Button */}
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          role="button"
        >
          &times;
        </button>

        {/* Modal Content */}
        <p className="text-gray-700 text-center">{message}</p>

        {/* Close Button at Bottom */}
        <div className="mt-4 flex justify-center">
          <button 
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-semibold"
            onClick={onClose}
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
