import React, { useRef, useEffect, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="relative w-20 h-20">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full">
            <LuUser className="text-4xl text-primary" />
          </div>
        )}

        <div className="absolute -bottom-1 -right-1 flex gap-1">
          {previewUrl && (
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full"
              onClick={handleRemoveImage}
              title="Удалить"
            >
              <LuTrash size={16} />
            </button>
          )}

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full"
            onClick={onChooseFile}
            title="Загрузить"
          >
            <LuUpload size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoSelector;
