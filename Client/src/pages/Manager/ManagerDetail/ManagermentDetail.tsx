
// import "./ManagermentDetail.scss";

export default function ManagermentDetail() {
  return (
    <div className="managerDetail-container">
      <div className="tool-setting">
        {/* ===== Tiêu đề & nút thêm nhiệm vụ ===== */}
        <div className="title-section">
          <p className="title">Xây dựng website thương mại điện tử</p>

          <div className="imgs">
            <img src="" alt="project" />
            <p className="subtitle-img"></p>
          </div>

          <button className="btn-create-project">+ Thêm nhiệm vụ</button>
        </div>

        {/* ===== Thành viên ===== */}
        <div className="member">
          <div className="member-head">
            <p className="member-title">Thành viên</p>
            <button className="btn-create-member">+ Thêm thành viên</button>
          </div>

          <div className="member-body">
            <div className="img-user">
              <img src="" alt="user" />
              <p>An Nguyen</p>
              <p>Project Owner</p>
            </div>

            <div className="body-icon">
              <p>📄</p>
            </div>
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
      </div>
    </div>
  );
}
