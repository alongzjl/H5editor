/**
 * Created by sunlong on 16/8/3.
 */
import React from 'react';
import { Button, Form } from 'antd';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';
import Auth from '../../common/Auth';
import './user.less';

const FormItem = Form.Item;

class LoginForm extends React.Component {
    login = () => {
        const loginName = this.loginName.value;
        const password = this.password.value;
        Fetch.post(API_URL.user.login, { emailOrPhone: loginName, password }).then(token => {
            new Auth().login(token);
        });
    };

    render() {
        return (
            <Form layout="horizontal" className="loginForm">
                <FormItem
                    label="手机号"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 13 }}
                >
                    <input ref={com => { this.loginName = com; }} type="text" />
                </FormItem>
                <FormItem
                    label="密码"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 13 }}
                >
                    <input ref={com => { this.password = com; }} type="password" />
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 13, offset: 11 }}
                >
                    <Button type="primary" htmlType="submit" onClick={this.login}>登录</Button>
                </FormItem>
            </Form>
        );
    }
}

export default LoginForm;
