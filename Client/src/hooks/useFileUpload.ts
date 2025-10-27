import { message } from "antd";
import type { RcFile } from "antd/es/upload";

/**
 * Custom hook để xử lý việc upload file -> trả về URL local để sử dụng làm hình ảnh dự án
 */
export const useFileUpload = () => {
  /**
   * Kiểm tra file trước khi upload
   */
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Bạn chỉ có thể tải lên file hình ảnh!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    return true;
  };

  /**
   * Upload file và trả về URL local
   */
  const uploadFile = async (file: File): Promise<string> => {
    try {
      // Tạo blob từ file
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      // Tạo URL local cho file
      const localUrl = URL.createObjectURL(blob);
      return localUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Không thể tải lên file. Vui lòng thử lại!");
      throw new Error("Failed to upload file");
    }
  };

  return { beforeUpload, uploadFile };
};
