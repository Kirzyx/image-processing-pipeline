import React, { useState } from "react";

type ImageOptions = {
  format: string;
  width: number | null;
  height: number | null;
};

const AdvancedOptionsModal = ({
  file,
  options,
  onClose,
  onSave,
}: {
  file: File;
  options: ImageOptions;
  onClose: () => void;
  onSave: (newOptions: ImageOptions) => void;
}) => {
  const [localOptions, setLocalOptions] = useState<ImageOptions>(options);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-neutral-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-neutral-200 mb-4">
          Advanced Options (Optional)
        </h2>
        <p className="text-neutral-400 mb-6">
          File name: <span className="text-neutral-300">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
        </p>

        {/* Resize Options */}
        <div className="mb-4">
          <label className="text-neutral-300 text-sm block mb-2">Resize Output Image</label>
          <select
            value={localOptions.width || "original"}
            onChange={(e) =>
              setLocalOptions({
                ...localOptions,
                width: e.target.value === "original" ? null : parseInt(e.target.value),
              })
            }
            className="w-full p-2 rounded bg-neutral-800 text-neutral-300"
          >
            <option value="original">Keep original size</option>
            <option value="800">800px Width</option>
            <option value="1024">1024px Width</option>
          </select>
        </div>

        {/* Compression Options */}
        <div className="mb-4">
          <label className="text-neutral-300 text-sm block mb-2">Compress Output Image</label>
          <select
            value={localOptions.format}
            onChange={(e) => setLocalOptions({ ...localOptions, format: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-neutral-300"
          >
            <option value="jpeg">No Compression</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="bg-neutral-700 text-neutral-300 px-4 py-2 rounded hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(localOptions)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedOptionsModal;
