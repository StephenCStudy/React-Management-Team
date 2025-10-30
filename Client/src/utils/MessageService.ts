import type { MessageInstance } from "antd/es/message/interface";

// Singleton để lưu trữ messageApi
class MessageService {
  private static instance: MessageInstance | null = null;

  static setMessageApi(messageApi: MessageInstance) {
    this.instance = messageApi;
  }

  static getMessageApi(): MessageInstance {
    if (!this.instance) {
      throw new Error(
        "MessageApi chưa được khởi tạo. Hãy đảm bảo MessageProvider được wrap ở cấp cao nhất."
      );
    }
    return this.instance;
  }
}

export default MessageService;
