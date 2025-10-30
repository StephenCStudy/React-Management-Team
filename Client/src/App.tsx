import RouterSetup from "./routes/RouterSetup";
import { MessageProvider } from "./contexts/MessageContext"; 
// dùng context quản lý message toàn cục thay vì gọi trực tiếp message của antd
export default function App() {
  return (
    <MessageProvider> 
      <div>
        <RouterSetup />
      </div>
    </MessageProvider>
  );
}
