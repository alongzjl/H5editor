import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router';

class Sidebar extends React.Component {
    render() {
        return (
            <Menu
                style={{ marginTop: '0.5rem' }}
                selectedKeys={[this.props.current]}
                mode="inline"
            >
                <Menu.Item key="1"><Link to="/template">模板列表</Link></Menu.Item>
            </Menu>
        );
    }
}

export default Sidebar;
