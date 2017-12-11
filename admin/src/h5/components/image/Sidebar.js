import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router';

function Sidebar(props) {
    return (
        <Menu
            style={{ marginTop: '0.5rem' }}
            selectedKeys={[props.current]}
            mode="inline"
        >
            <Menu.Item key="image"><Link to="/image">图片列表</Link></Menu.Item>
            <Menu.Item key="category"><Link to="/category/image">分类管理</Link></Menu.Item>
        </Menu>
    );
}

export default Sidebar;
