import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router';

class UserSidebar extends React.Component {
    render = () => (
        <Menu
            style={{ marginTop: '0.5rem' }}
            selectedKeys={[this.props.current]}
            mode="inline"
        >
            <Menu.Item key="user"><Link to="/user">用户列表</Link></Menu.Item>
        </Menu>
        )
}

UserSidebar.propTypes = {
    current: React.PropTypes.string.isRequired,
};

export default UserSidebar;
