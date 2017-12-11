/**
 * Created by sunlong on 16/8/6.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, message, Col, Row } from 'antd';
import Fetch from '../../common/FetchIt';
import store from '../../store';
import API_URL from '../../common/url';
import { changeUser } from '../actions/userInfoActions';
import Header from '../../common/header/Header';
import Sidebar from './Sidebar';
import './groupBuy.less';

const FormItem = Form.Item;

class UserInfoForm extends React.Component {
    submit = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log('Errors in form!!!');
                return;
            }
            Fetch.putJSON(`${API_URL.user.info}`, { body: JSON.stringify(values) }).then(() => {
                message.info('修改成功!');
            });
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form horizontal>
                <FormItem
                    label="手机"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('phone', {
                            rules: [{ max: 16, message: '最多16个字符' }, { required: true, message: '必填' }],
                        })(<Input type="text" />)
                    }
                </FormItem>
                <FormItem
                    label="姓名"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('trueName', {
                            rules: [{ max: 64, message: '最多64个字符' }],
                        })(<Input type="text" />)
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
UserInfoForm.propTypes = {
    form: React.PropTypes.shape().isRequired,
};

class UserInfo extends React.Component {
    componentDidMount = () => {
        this.loadData(1);
    };

    loadData = () => {
        Fetch.get(API_URL.user.info).then(user => store.dispatch(changeUser(user)));
    };

    render = () => {
        const mapPropsToFields = () => ({
            phone: { value: this.props.user.phone },
            trueName: { value: this.props.user.trueName },
        });

        UserInfoForm = Form.create({ mapPropsToFields })(UserInfoForm);
        return (
            <div>
                <Header current="userInfo" />
                <div className="groupBuy">
                    <Row>
                        <Col span={4}>
                            <Sidebar current="2" />
                        </Col>
                        <Col span={20}>
                            <UserInfoForm />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

UserInfo.propTypes = {
    user: React.PropTypes.shape({
        phone: React.PropTypes.string,
        email: React.PropTypes.string,
    }).isRequired,
};

const mapStateToProps = function (store) {
    return {
        user: store.userInfoState.user,
    };
};

export default connect(mapStateToProps)(UserInfo);
