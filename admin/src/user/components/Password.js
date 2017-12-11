/**
 * Created by sunlong on 16/8/6.
 */
import React from 'react';
import { Button, Form, Input, message, Row, Col } from 'antd';
import Header from '../../common/header/Header';
import Sidebar from './Sidebar';
import './groupBuy.less';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';

const FormItem = Form.Item;

class PasswordForm extends React.Component {
    submit = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log('Errors in form!!!');
                return;
            }
            Fetch.put(`${API_URL.user.password}`, values).then(() => {
                message.info('修改成功!');
            });
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form horizontal>
                <FormItem
                    label="旧密码"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('oldPassword', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })(<Input type="password" />)
                    }
                </FormItem>
                <FormItem
                    label="新密码"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('password', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })(<Input type="password" />)
                    }
                </FormItem>
                <FormItem
                    label="重复密码"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('rePassword', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })(<Input type="password" />)
                    }
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 14, offset: 6 }}
                >
                    <Button type="primary" onClick={this.submit}>保存</Button>
                </FormItem>
            </Form>
        );
    }
}

PasswordForm.propTypes = {
    form: React.PropTypes.shape().isRequired,
};

function Password() {
    const NewPasswordForm = Form.create({})(PasswordForm);
    return (
        <div>
            <Header current="userInfo" />
            <div className="groupBuy">
                <Row>
                    <Col span={4}>
                        <Sidebar current="3" />
                    </Col>
                    <Col span={20}>
                        <NewPasswordForm />
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Password;
