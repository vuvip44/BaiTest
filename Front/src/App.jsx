import React, { useState } from 'react';

import GroupTree from './components/Group/GroupTree/GroupTree';
import UserList from './components/User/UserList/UserList';
const App = () => {
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Cột trái: Danh sách nhóm */}
            <div style={{ width: '100%', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
                <h2>Danh sách nhóm</h2>
                <GroupTree onGroupSelect={(groupId) => setSelectedGroupId(groupId)} />
            </div>

            {/* Cột phải: Danh sách người dùng */}
            {/* <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                <h2>Danh sách người dùng</h2>
                <UserList groupId={selectedGroupId} />
            </div> */}
            <div className="col-8">
                    {selectedGroupId ? (
                        <UserList selectedGroupId={selectedGroupId} />
                    ) : (
                        <p>Vui lòng chọn nhóm để xem danh sách người dùng.</p>
                    )}
                </div>
        </div>
    );
};

export default App;
