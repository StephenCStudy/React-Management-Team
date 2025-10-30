import type { MessageInstance } from "antd/es/message/interface"; // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
import type { RcFile } from "antd/es/upload";

/**
 * Custom hook để xử lý việc upload file -> trả về URL local để sử dụng làm hình ảnh dự án
 */
export const useFileUpload = (messageApi: MessageInstance) => {
  /**
   * Kiểm tra file trước khi upload
   */
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      messageApi.error("Bạn chỉ có thể tải lên file hình ảnh!"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("Hình ảnh phải nhỏ hơn 2MB!"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
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
      messageApi.error("Không thể tải lên file. Vui lòng thử lại!"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
      throw new Error("Failed to upload file");
    }
  };

  return { beforeUpload, uploadFile };
};
