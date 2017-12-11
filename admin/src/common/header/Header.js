/**
 * Created by sunlong on 16/7/24.
 */
import React from 'react';
import { Menu, Icon, Dropdown } from 'antd';
import { Link } from 'react-router';
import Auth from '../../common/Auth';
import './header.less';

class Header extends React.Component {
    logout = () => {
        new Auth().logout();
    };

    componentDidMount = () => {
        new Auth().check();
    };

    render = () => {
        const menu = (<Menu>
            <Menu.Item key="userInfo"><Link to="/user/info">修改个人信息</Link></Menu.Item>
            <Menu.Item key="password"><Link to="/user/password">修改密码</Link></Menu.Item>
            <Menu.Item key="logout"><a href="javascript:void(0)" onClick={this.logout}>退出</a></Menu.Item>
        </Menu>);

        return (
            <div className="header">
                <ul className="menu">
                    <li className={this.props.current === 'course' ? 'active' : ''}><Link to="/course">课程管理</Link></li>
                    <li className={this.props.current === 'template' ? 'active' : ''}><Link to="/template">模板管理</Link></li>
                    <li className={this.props.current === 'image' ? 'active' : ''}><Link to="/image">图片库管理</Link></li>
                    <li className={this.props.current === 'audio' ? 'active' : ''}><Link to="/audio">音频库管理</Link></li>
                    <li className={this.props.current === 'center' ? 'active' : ''}><Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" href="javascript:void(0)">
                            个人中心 <Icon type="down" />
                        </a>
                    </Dropdown></li>
                </ul>
            </div>

        );
    }
}

export default Header;
