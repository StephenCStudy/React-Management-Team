import React, { createContext, useContext, useEffect } from "react";
import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import MessageService from "../utils/MessageService";

//--------------------------------------------------------
//AI tạo context quản lý messageApi toàn cục vì antd v5 không hỗ trợ dùng message trong react 19
//--------------------------------------------------------
// Tạo Context để share messageApi
const MessageContext = createContext<MessageInstance | null>(null);

// Hook để sử dụng messageApi trong các component
export const useMessageApi = () => {
  const messageApi = useContext(MessageContext);
  if (!messageApi) {
    throw new Error("useMessageApi must be used within MessageProvider");
  }
  return messageApi;
};

// Provider component để wrap toàn bộ app
export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  // Set messageApi vào singleton để có thể sử dụng ở nơi khác (slices, utils, etc)
  useEffect(() => {
    MessageService.setMessageApi(messageApi);
  }, [messageApi]);

  return (
    <MessageContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};
