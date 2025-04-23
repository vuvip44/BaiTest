import { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { getUsersByGroup, createUser, updateUser, deleteUser } from "../../../api/userApi";

function UserList({ selectedGroupId }) {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        dateOfBirth: '',
        isMale: true,
        phoneNumber: '',
        email: '',
        orderNumber: 0,
    });

    const fetchUsers = async () => {
        if (!selectedGroupId) return;
        try {
            const data = await getUsersByGroup(selectedGroupId);
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [selectedGroupId]);

    const handleShowModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                id: user.id, 
                username: user.username,
                fullName: user.fullName,
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
                isMale: user.isMale,
                phoneNumber: user.phoneNumber,
                email: user.email,
                orderNumber: user.orderNumber,
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                fullName: '',
                dateOfBirth: '',
                isMale: true,
                phoneNumber: '',
                email: '',
                orderNumber: 0,
            });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (editingUser) {
                await updateUser(editingUser.id, { ...formData, id: editingUser.id, groupId: selectedGroupId });

            } else {
                await createUser({ ...formData, groupId: selectedGroupId });
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
            try {
                await deleteUser(userId);
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Danh sách người dùng</h5>
                <Button variant="primary" onClick={() => handleShowModal()}>Thêm User</Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Họ tên</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>SĐT</th>
                        <th>Email</th>
                        <th>Thứ tự</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.fullName}</td>
                            <td>{user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : ''}</td>
                            <td>{user.isMale ? "Nam" : "Nữ"}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.email}</td>
                            <td>{user.orderNumber}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleShowModal(user)}>Sửa</Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal thêm/sửa user */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingUser ? "Cập nhật người dùng" : "Thêm người dùng"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giới tính</Form.Label>
                            <Form.Select
                                value={formData.isMale ? "true" : "false"}
                                onChange={(e) => setFormData({ ...formData, isMale: e.target.value === "true" })}
                            >
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thứ tự</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.orderNumber}
                                onChange={(e) => setFormData({ ...formData, orderNumber: parseInt(e.target.value) })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserList;
