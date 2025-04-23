import { Modal, Button } from 'react-bootstrap';
function GroupDetail({
    show,
    onClose,
    groupDetail
}) {
    if (!groupDetail) return null; // Kiểm tra nếu groupDetail không tồn tại
    return ( 
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chi  tiết nhóm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Tên nhóm:</strong> {groupDetail.name}</p>
                <p><strong>Mã nhóm:</strong> {groupDetail.code}</p>
                <p><strong>Nhóm cha:</strong> {groupDetail.parentName || 'Không có'}</p>
                <p><strong>Thứ tự:</strong> {groupDetail.orderNum}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
                
            </Modal.Footer>
        </Modal> 
     );
}

export default GroupDetail;