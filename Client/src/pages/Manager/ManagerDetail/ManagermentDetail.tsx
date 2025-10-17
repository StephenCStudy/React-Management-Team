import React from "react";
import { Table, Tag, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./ManagermentDetail.scss";

interface Task {
  key: string;
  name: string;
  assignee: string;
  priority: "Thấp" | "Trung bình" | "Cao";
  startDate: string;
  endDate: string;
  status: "Đang tiến độ" | "Có rủi ro" | "Trễ hạn";
}

const data: Task[] = [
  {
    key: "1",
    name: "Soạn thảo đề cương dự án",
    assignee: "An Nguyễn",
    priority: "Thấp",
    startDate: "02-24",
    endDate: "02-27",
    status: "Đang tiến độ",
  },
  {
    key: "2",
    name: "Soạn thảo báo cáo",
    assignee: "An Nguyễn",
    priority: "Trung bình",
    startDate: "02-24",
    endDate: "02-27",
    status: "Có rủi ro",
  },
  {
    key: "3",
    name: "Lên lịch họp kickoff",
    assignee: "An Nguyễn",
    priority: "Cao",
    startDate: "02-24",
    endDate: "02-27",
    status: "Trễ hạn",
  },
];

const ManagermentDetail: React.FC = () => {
  const columns: ColumnsType<Task> = [
    {
      title: "Tên Nhiệm Vụ",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="task-name">{text}</span>,
    },
    {
      title: "Người Phụ Trách",
      dataIndex: "assignee",
      key: "assignee",
    },
    {
      title: "Ưu Tiên",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        let color = "";
        if (priority === "Thấp") color = "cyan";
        else if (priority === "Trung bình") color = "gold";
        else color = "red";
        return (
          <Tag color={color} className={`priority ${priority.toLowerCase()}`}>
            {priority}
          </Tag>
        );
      },
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Hạn Chót",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Tiến Độ",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        if (status === "Đang tiến độ") color = "green";
        else if (status === "Có rủi ro") color = "orange";
        else color = "red";
        return (
          <Tag color={color} className={`status ${status.toLowerCase()}`}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Hành Động",
      key: "action",
      render: () => (
        <>
          <Button className="btn-edit">Sửa</Button>
          <Button className="btn-delete">Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div className="managerDetail-container">
      <div className="tool-setting">
        <div className="title-section">
          <div className="title-box">
            <p className="title">Xây dựng website thương mại điện tử</p>
          </div>
          <div className="imgs">
            <img
              src="https://thvnext.bing.com/th/id/OIP.6mIEhub14VrCFHQBNU-0XwHaE7?w=229&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3"
              alt="project"
              className="project-img"
            />
            <p className="subtitle-img">
              Dự án nhằm phát triển một nền tảng thương mại điện tử với các tính
              năng như giỏ hàng, thanh toán và quản lý sản phẩm.
            </p>
          </div>
          <button className="btn-create-project">+ Thêm nhiệm vụ</button>
        </div>

        <div className="member">
          <div className="member-head">
            <p className="member-title">Thành viên</p>
            <button className="btn-create-member">+ Thêm thành viên</button>
          </div>

          <div className="member-body">
            <div className="img-user">
              <div className="avatar">AN</div>
              <div className="info">
                <p className="name">An Nguyễn</p>
                <p className="role">Project Owner</p>
              </div>
            </div>

            <div className="img-user">
              <div className="avatar purple">BA</div>
              <div className="info">
                <p className="name">Bách Nguyễn</p>
                <p className="role">Frontend Developer</p>
              </div>
            </div>

            <div className="body-icon">⋯</div>
          </div>

          <div className="member-tool">
            <select>
              <option defaultValue="">Sắp xếp theo</option>
            </select>
            <input type="text" placeholder="Tìm kiếm nhiệm vụ" />
          </div>
        </div>
      </div>

      <div className="table">
        <p className="title-table">Danh Sách Nhiệm Vụ</p>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default ManagermentDetail;
