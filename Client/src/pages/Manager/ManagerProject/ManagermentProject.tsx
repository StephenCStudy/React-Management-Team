import { Table, Button } from "antd";
import "./ManagermentProject.scss";

export default function ManagermentProject() {
  const dataSource = [
    { key: "1", id: 1, name: "Xây dựng website thương mại điện tử" },
    { key: "2", id: 2, name: "Phát triển ứng dụng di động" },
    { key: "3", id: 3, name: "Quản lý dữ liệu khách hàng" },
    { key: "4", id: 4, name: "Xây dựng website thương mại điện tử" },
    { key: "5", id: 5, name: "Phát triển ứng dụng di động" },
    { key: "6", id: 6, name: "Quản lý dữ liệu khách hàng" },
    { key: "7", id: 7, name: "Xây dựng website thương mại điện tử" },
    { key: "8", id: 8, name: "Phát triển ứng dụng di động" },
    { key: "9", id: 9, name: "Quản lý dữ liệu khách hàng" },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 80,
    },
    {
      title: "Tên Dự Án",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành Động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="action-buttons">
          <Button className="btn-edit">Sửa</Button>
          <Button className="btn-delete">Xóa</Button>
          <Button className="btn-detail">Chi tiết</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="Manager-container">
      <h1 className="Manager-title">Quản lý dự án</h1>

      <div className="Manager-setting">
        <Button className="Manager-create">+ Thêm dự án</Button>
        <input className="Manager-search" placeholder="Tìm kiếm..." />
      </div>

      <p className="title-table">Danh sách dự án</p>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 9 }}
        bordered
      />
    </div>
  );
}
