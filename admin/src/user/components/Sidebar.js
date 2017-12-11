import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router';
import Auth from '../../common/Auth';

class Sidebar extends React.Component {
    logout = () => {
        new Auth().logout();
    };

    render = () => (
        <Menu
            style={{ marginTop: '0.5rem' }}
            selectedKeys={[this.props.current]}
            mode="inline"
        >
            <Menu.Item key="2"><Link to="/user/info">修改个人信息</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/user/password">修改密码</Link></Menu.Item>
            <Menu.Item key="4"><a href="javascript:void(0)" onClick={this.logout}>退出</a></Menu.Item>
        </Menu>
        )
}

Sidebar.propTypes = {
    current: React.PropTypes.string.isRequired,
};

export default Sidebar;
