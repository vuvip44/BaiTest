import { Modal, Button } from "react-bootstrap";

function UserDetail({ show, onClose, userDetail }) {
  if (!userDetail) return null;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết người dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Tài khoản:</strong> {userDetail.username}</p>
        <p><strong>Họ tên:</strong> {userDetail.fullName}</p>
        <p><strong>Ngày sinh:</strong> {new Date(userDetail.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>Giới tính:</strong> {userDetail.isMale ? "Nam" : "Nữ"}</p>
        <p><strong>Số điện thoại:</strong> {userDetail.phoneNumber}</p>
        <p><strong>Email:</strong> {userDetail.email}</p>
        <p><strong>Nhóm:</strong> {userDetail.groupName}</p>
        <p><strong>Thứ tự:</strong> {userDetail.orderNumber}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserDetail;
