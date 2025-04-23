import { useEffect, useState } from "react";
import { getAllGroups, createGroup, getGroupById, deleteGroup, updateGroup } from "../../../api/groupApi";
import GroupModal from "../GroupModal/GroupModal";
import GroupDetail from "../GroupDetail/GroupDetail";
import Styles from "./styles.module.scss";
import { getUserById, getUsersByGroup, createUser, updateUser, deleteUser } from "../../../api/userApi";
import $ from 'jquery';      
import 'jstree';            
import context from "react-bootstrap/esm/AccordionContext";

function GroupTree({ onGroupSelect }) {
  const { btn } = Styles;

  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [codegroup, setCodeGroup] = useState("");
  const [parentGroupId, setParentGroupId] = useState(null);
  const [selectedGroupDetail, setSelectedGroupDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);




  const initTree = (groupsData) => {
    const treeData = groupsData.map((group) => ({
      id: group.id,
      parent: group.parentId ? group.parentId : "#",
      text: group.name,
    }));

    $('#group-tree').jstree('destroy'); 
    $('#group-tree').jstree({
      core: {
        data: treeData,
        multiple: false,
        check_callback: true,
      },
      plugins: ["contextmenu"],
      contextmenu: {
        items:customMenu
      }
    }).on("select_node.jstree", (e, data) => {
      onGroupSelect(data.node.id);
    });
  };

  const customMenu = (node) => {
    return{
      detailItem:{
        label:"Xem chi tiết",
        action: async()=>{
          const groupDetail=await getGroupById(node.id);
          const parentGroup=groups.find((g)=>g.id===groupDetail.parentId);
          const parentGroupName=parentGroup?parentGroup.name:null;
          setSelectedGroupDetail({
            ...groupDetail,
            parentName:parentGroupName,
          });
          setShowDetail(true);
        }
      },
      updateItem:{
        label:"Cập nhật",
        action: async()=>{
          const group=groups.find((g)=>g.id===parseInt(node.id));
          if(group){
            setGroupName(group.name);
            setCodeGroup(group.code);
            setParentGroupId(group.parentId);
            setEditingGroup(group);
            setShowModal(true);
          }
        }
      },
      deleteItem:{
        label:"Xóa",
        action: async()=>{
          try {
            if(window.confirm("Bạn có chắc chắn muốn xóa nhóm này không?")){
              await deleteGroup(node.id);
              await fetchGroups();
            }
          } catch (error) {
            console.error("Error deleting group:", error);
            alert("Không thể xóa nhóm!");
          }
        }
      }
    }
  }
  
  console.log("Selected group detail:", selectedGroupDetail);
  const fetchGroups = async () => {
    try {
      const data = await getAllGroups();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      initTree(groups);
    }
  }, [groups]);

  const handleSave = async () => {
    if (!groupName || !codegroup) {
      alert("Vui lòng nhập tên và mã nhóm.");
      return;
    }
    const newGroup = {
      id: editingGroup ? editingGroup.id : 0,
      name: groupName,
      code: codegroup,
      parentId: parentGroupId ? parseInt(parentGroupId) : null,
      orderNumber: editingGroup? editingGroup.orderNumber : 0,
    };
    try {
      if (editingGroup) {
        await updateGroup(editingGroup.id, newGroup);
      }else{
        await createGroup(newGroup);
      }
      
      await fetchGroups();
      setShowModal(false);
      setGroupName("");
      setCodeGroup("");
      setParentGroupId(null);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Có lỗi ");
    }
  };

  return (
    <div>
      <div className={btn}>
        <button onClick={() => setShowModal(true)}>Thêm Nhóm</button>
      </div>
      <div id="group-tree"></div>
      <GroupModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        groupName={groupName}
        setGroupName={setGroupName}
        codegroup={codegroup}
        setCodeGroup={setCodeGroup}
        parentGroupId={parentGroupId}
        setParentGroupId={setParentGroupId}
        groups={groups}
        isExistingGroup={!!editingGroup}
      />
      <GroupDetail
        show={showDetail}
        onClose={() => setShowDetail(false)}
        groupDetail={selectedGroupDetail}
      />
    </div>
  );
}

export default GroupTree;
