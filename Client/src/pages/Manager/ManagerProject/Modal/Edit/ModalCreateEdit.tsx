import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import "./ModalCreateEdit.scss";
import { useAppDispatch } from "../../../../../apis/store/hooks";
import { useFileUpload } from "../../../../../hooks/useFileUpload";
import {
  addProject,
  updateProject,
} from "../../../../../apis/store/slice/projects/projects.slice";

interface ModalCreateEditProps {
  open: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  project?: any;
}

const ModalCreateEdit: React.FC<ModalCreateEditProps> = ({
  open,
  onCancel,
  onOk,
  project,
}) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  // Khi modal mở hoặc project thay đổi, thiết lập giá trị form ban đầu.
  // Sử dụng project.projectName nếu có,
  useEffect(() => {
    if (open && project) {
      // console.log("Setting form values for project:", project);
      form.setFieldsValue({
        projectName: project.projectName ?? project.name ?? "",
        description: project.description ?? "",
      });

      if (project.image) {
        setFileList([
          {
            uid: "-1",
            name: "project-image.png",
            status: "done",
            url: project.image,
          },
        ]);
      } else {
        setFileList([]);
      }
    } else if (open && !project) {
      // Tạo mới - reset form
      form.resetFields();
      setFileList([]);
    }
  }, [open, project, form]);

  const { beforeUpload, uploadFile } = useFileUpload();

  // Xử lý lưu dự án khi người dùng nhấn nút Lưu
  const handleSave = async (values: any) => {
    try {
      // Handle image upload if there's a new image
      let imagePath = project ? project.image : "";
      if (fileList.length > 0 && fileList[0].originFileObj) {
        imagePath = await uploadFile(fileList[0].originFileObj);
      }

      if (project) {
        // Update existing project
        await dispatch(
          updateProject({
            id: project.id,
            projectName: values.projectName, // Đảm bảo tên field là projectName khi gửi lên server
            description: values.description,
            image: imagePath || project.image,
            members: project.members || [],
          })
        );
      } else {
        // Create new project
        await dispatch(
          addProject({
            projectName: values.projectName, // Đảm bảo tên field là projectName khi gửi lên server
            description: values.description,
            image: imagePath || "/default-project-image.png",
            members: [],
          })
        );
      }
      if (onOk) onOk();
    } catch (err) {
      console.error("Failed to save project:", err);
      setError("Có lỗi xảy ra khi lưu dự án");
    }
  };

  // Xử lý khi người dùng hủy modal
  const handleCancel = () => {
    form.resetFields();
    setError("");
    if (onCancel) onCancel();
  };

  return (
    <Modal
      title={
        <h3 className="modal-title">
          {project ? "Sửa dự án" : "Thêm dự án mới"}
        </h3>
      }
      open={open}
      centered
      width={480}
      footer={null}
      onCancel={handleCancel}
      className="modal-create-edit"
      // giữ nguyên children để tránh các vấn đề về thời gian mount lại form
    >
      <Form
        form={form}
        layout="vertical"
        className="modal-content"
        onFinish={handleSave}
        preserve={false}
      >
        <Form.Item
          label="Tên dự án"
          name="projectName"
          rules={[{ required: true, message: "Vui lòng nhập tên dự án!" }]}
        >
          <Input placeholder="Nhập tên dự án" />
        </Form.Item>

        <Form.Item label="Mô tả dự án" name="description">
          <Input.TextArea placeholder="Nhập mô tả..." />
        </Form.Item>

        <Form.Item
          label="Hình ảnh dự án"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList || [];
          }}
        >
          <Upload // thêm hình ảnh
            accept="image/*"
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={({ fileList: newFileList }) => {
              setFileList(newFileList);
            }}
            customRequest={async ({ file, onSuccess }) => {
              if (file instanceof File) {
                try {
                  await uploadFile(file);
                  onSuccess?.("ok");
                } catch (error) {
                  message.error("Upload failed");
                }
              }
            }}
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {error && <p className="error-text">{error}</p>}
        <div className="modal-actions">
          <button className="btn-cancel" type="button" onClick={handleCancel}>
            Hủy
          </button>
          <button className="btn-save" type="submit">
            {project ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCreateEdit;
