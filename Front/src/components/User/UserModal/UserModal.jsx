import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

function UserModal({
  show,
  onClose,
  onSave,
  userData,
  groups,
}) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isMale, setIsMale] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState(0);
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setFullName(userData.fullName);
      setDateOfBirth(userData.dateOfBirth);
      setIsMale(userData.isMale);
      setPhoneNumber(userData.phoneNumber);
      setEmail(userData.email);
      setOrderNumber(userData.orderNumber);
      setGroupId(userData.groupId);
    } else {
      // Reset fields if no userData
      setUsername("");
      setFullName("");
      setDateOfBirth("");
      setIsMale(true);
      setPhoneNumber("");
      setEmail("");
      setOrderNumber(0);
      setGroupId("");
    }
  }, [userData]);

  const handleSave = () => {
    const newUser = {
      username,
      fullName,
      dateOfBirth,
      isMale,
      phoneNumber,
      email,
      orderNumber,
      groupId,
    };

    onSave(newUser);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{userData ? "Cập nhật người dùng" : "Thêm mới người dùng"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tài khoản</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày sinh</Form.Label>
            <Form.Control
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giới tính</Form.Label>
            <Form.Check
              type="radio"
              label="Nam"
              checked={isMale}
              onChange={() => setIsMale(true)}
            />
            <Form.Check
              type="radio"
              label="Nữ"
              checked={!isMale}
              onChange={() => setIsMale(false)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nhóm</Form.Label>
            <Form.Select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              required
            >
              <option value="">Chọn nhóm</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Thứ tự</Form.Label>
            <Form.Control
              type="number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserModal;
