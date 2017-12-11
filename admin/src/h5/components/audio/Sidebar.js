import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router';

const Sidebar = React.createClass({
    render() {
        return (
            <Menu
                style={{ marginTop: '0.5rem' }}
                selectedKeys={[this.props.current]}
                mode="inline"
            >
                <Menu.Item key="1"><Link to="/audio">音频列表</Link></Menu.Item>
                <Menu.Item key="category"><Link to="/category/audio">分类管理</Link></Menu.Item>
            </Menu>
        );
    },
});

export default Sidebar;
