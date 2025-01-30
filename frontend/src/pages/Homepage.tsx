import { useState } from "react";
import Modal from "../components/Modal";
import { API_URL } from "../utils/envUrl";

export default function Homepage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      setFiles((prevFiles) => {
        // Gabungkan file baru dengan file yang sudah ada
        return [...prevFiles, ...Array.from(newFiles)];
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      setModalMessage(result.message);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
  };

  // Fungsi untuk mengambil ekstensi file
  const getFileExtension = (fileName: string) => {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() : "Unknown Format";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    window.location.reload();
    setModalMessage('');
  };

  return (
    <main className="h-fit flex flex-col gap-16 items-center p-6">
      <header className="flex flex-col mt-16 items-center justify-center gap-4">
        <h1 className="text-5xl font-semibold title-gradient">
          Fontinstaller Tools
        </h1>
        <p>One-Click Font Installation Made Simple</p>
      </header>
      <div className="min-w-2xl h-fit p-8 bg-dark-200/80 rounded-lg border border-dark-500">
        <h1 className="text-xl font-semibold mb-4 text-center">Upload Fonts</h1>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col items-center space-y-4">

            <label htmlFor="file-upload" className="cursor-pointer bg-pink-700 border-white/50 border text-white py-2 px-4 rounded-md transition-all transform">
              {files.length > 0 ? "Add More Files" : "Select File"}
            </label>

            <input
              id="file-upload"
              type="file"
              name="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* List File yang Diupload */}
          <div className="mt-3 flex flex-col gap-4 max-w-2xl flex-wrap">
            {files.map((file, index) => (
              <div key={index} className="bg-gray-200 py-3 px-6 rounded-lg flex gap-4 items-center">
                <p className={`${getFileExtension(file.name) === "otf" || getFileExtension(file.name) === "ttf" ? "text-purple-700" : "text-emerald-600"} text-sm text-wrap font-semibold uppercase`}>
                  {getFileExtension(file.name) === "otf" || getFileExtension(file.name) === "ttf"
                    ? getFileExtension(file.name)?.toUpperCase() + " File Format"
                    : "Unknown Format"}
                </p>
                <p className="text-gray-600">{file.name}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.name)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
            {files.length === 0 && <p className="text-light-500 text-center">no file uploaded</p>}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white font-semibold transition ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Installing...' : 'Install'}
          </button>
        </form>
      </div>

      {isModalOpen && <Modal message={modalMessage} onClose={closeModal} />}
    </main>
  );
}
