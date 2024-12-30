import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import AdvancedOptionsModal from "../components/AdvancedOptionsModal";
import { useEffect } from "react";



type ImageOptions = {
  format: string;
  width: number | null;
  height: number | null;
};

const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [imageOptions, setImageOptions] = useState<ImageOptions[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  
  useEffect(() => {
    if (activeModalIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [activeModalIndex]);
  const onDrop = (acceptedFiles: File[]) => {
    const uniqueFiles = acceptedFiles.filter(
      (newFile) =>
        !files.some(
          (existingFile) =>
            existingFile.name === newFile.name && existingFile.size === newFile.size
        )
    );
    setFiles((prevFiles) => [...prevFiles, ...uniqueFiles]);
    
    const newOptions = uniqueFiles.map(() => ({
      format: "jpeg", // Default format
      width: null, // No resizing by default
      height: null,
    }));
    setImageOptions((prevOptions) => [...prevOptions, ...newOptions]);
  };
  
  

  const handleFormatChange = (index: number, format: string) => {
    const updatedOptions = [...imageOptions];
    updatedOptions[index].format = format;
    setImageOptions(updatedOptions);
  };

  const handleResizeChange = (
    index: number,
    width: number | null,
    height: number | null
  ) => {
    const updatedOptions = [...imageOptions];
    updatedOptions[index].width = width;
    updatedOptions[index].height = height;
    setImageOptions(updatedOptions);
  };

  const uploadFiles = async () => {
    setIsUploading(true);
    try {
      console.log("Files to upload:", files);
      console.log("Options:", imageOptions);

      alert("Files uploaded with selected options (mock implementation).");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload files.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
  });

  return (
    <div className="max-w-4xl mx-auto bg-darkBg text-darkText rounded-lg shadow-lg p-6">
      <h1 className="text-3xl text-neutral-200 font-bold mb-6 text-center">
        Upload Your Files
      </h1>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`flex items-center justify-center border-2 border-dashed rounded-lg px-64 py-24 w-full text-center transition ${
          isDragActive ? "border-accent bg-neutral-600" : "border-neutral-800 hover:bg-neutral-900 cursor-pointer"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p className="text-neutral-300 text-lg">
            Drag & drop images here, or click to select files
          </p>
        )}
      </div>

      {/* File List */}
      <ul className="mt-6 space-y-4">
        {files.map((file, index) => (
          <li
            key={index}
            className="flex items-center justify-between border border-neutral-700 rounded-lg p-4"
          >
            {/* Image and File Info */}
            <div className="flex items-center space-x-4">
              {/* Image Preview */}
              <div className="flex-shrink-0 w-20 h-20 border border-neutral-800 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* File Info */}
              <div className="text-left">
                <p className="text-neutral-300 text-sm font-medium truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-neutral-500 text-xs">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>

            {/* Convert, Gear Options, and Remove Button */}
            <div className="flex items-center space-x-4">
              {/* Format Selection */}
              <div className="flex items-center space-x-2">
                <label className="text-neutral-300 text-sm">Convert To:</label>
                <select
                  value={imageOptions[index]?.format || "jpeg"}
                  onChange={(e) => handleFormatChange(index, e.target.value)}
                  className="w-24 p-1 rounded bg-neutral-800 text-neutral-300"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>

              {/* Gear Icon and Modal */}
              <div>
                <button
                  aria-label="Resize Options"
                  onClick={() => setActiveModalIndex(index)}
                  className="text-neutral-400 text-xl hover:text-white transition"
                >
                  ⚙
                </button>

                {activeModalIndex === index && (
                  <AdvancedOptionsModal
                    file={file}
                    options={imageOptions[index]}
                    onClose={() => setActiveModalIndex(null)}
                    onSave={(newOptions) => {
                      const updatedOptions = [...imageOptions];
                      updatedOptions[index] = newOptions;
                      setImageOptions(updatedOptions);
                      setActiveModalIndex(null);
                    }}
                  />
                )}
              </div>

              {/* Remove Button */}
              <div>
                <button
                  aria-label="Remove Image"
                  onClick={() => {
                    const updatedFiles = files.filter((_, i) => i !== index);
                    const updatedOptions = imageOptions.filter((_, i) => i !== index);
                    setFiles(updatedFiles);
                    setImageOptions(updatedOptions);
                  }}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>



      {/* Upload Button */}
      <button
        onClick={uploadFiles}
        disabled={isUploading}
        className={`mt-6 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-lg transition transform hover:scale-105 hover:shadow-lg px-4 py-2 ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isUploading ? "Uploading..." : "Upload and Convert"}
      </button>
    </div>
  );
};

export default FileUploader;
