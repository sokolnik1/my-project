import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const res = await axiosInstance.post("/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { imageUrl: res.data.url };
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return { imageUrl: "" };
  }
};

export default uploadImage;
