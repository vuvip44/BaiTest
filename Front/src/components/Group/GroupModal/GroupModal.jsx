import { Modal, Button, Form } from "react-bootstrap";

function GroupModal({
    show,
    onClose,
    onSave,
    groupName,
    setGroupName,
    parentGroupId,
    codegroup,
    setCodeGroup,
    setParentGroupId,
    groups,
    isExistingGroup,
}) {
    return ( 
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isExistingGroup?"Cập nhật":"Thêm mới"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên nhóm</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Nhập tên nhóm" 
                            value={groupName} 
                            onChange={(e) => setGroupName(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mã nhóm</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Nhập mã nhóm" 
                            value={codegroup} 
                            onChange={(e) => setCodeGroup(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3"> 
                        <Form.Label>Chọn nhóm cha</Form.Label>
                        <Form.Select
                            value={parentGroupId||""} 
                            onChange={(e) => setParentGroupId(e.target.value||null)}
                        >
                        <option value="">Khong co</option>
                        {groups.map((g)=>(
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={onSave}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal> 
     );
}

export default GroupModal;