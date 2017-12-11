import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Table, Button, Modal, Form, Input, message, Row, Col, Popconfirm } from 'antd';
import { listUsers, changeUser } from '../actions/userActions';
import Header from '../../common/header/Header';
import UserSidebar from './UserSidebar';
import Fetch from '../../common/FetchIt';
import store from '../../store';
import API_URL from '../../common/url';
import './groupBuy.less';

const FormItem = Form.Item;

class User extends React.Component {
    state = {
        page: 1,
    };

    changePage = page => {
        this.setState({
            page,
        }, () => {
            this.loadData();
        });
    };

    componentDidMount = () => {
        this.loadData();
    };

    loadData = (nickname = '') => {
        Fetch.get(`${API_URL.user.list}?page=${this.state.page}&keyword=${nickname.trim()}`).then(data => {
            store.dispatch(listUsers(data.content, data.totalElements));
        });
    };

    confirm = id => {
        Fetch.put(`${API_URL.teacher.check}${id}/1`).then(() => {
            message.success('审核通过!');
            this.loadData();
        });
    };

    cancel = id => {
        Fetch.put(`${API_URL.teacher.check}${id}/-2`).then(() => {
            message.success('已拒绝!');
            this.loadData();
        });
    };

    getColumns = () => [{
        title: '微信名/昵称',
        dataIndex: 'nickname',
        key: 'nickname',
    }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '手机',
        dataIndex: 'phone',
        key: 'phone',
    }, {
        title: '状态',
        dataIndex: 'active',
        key: 'active',
        render: text => text ? '启用中' : '已禁用',
    }, {
        title: '创建时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: text => (
                `${moment(text).format('YYYY年MM月DD日 HH:mm:SS')}`
            ),
    }, {
        title: '最后登录时间',
        dataIndex: 'loginDate',
        key: 'loginDate',
        render: text => (
                `${moment(text).format('YYYY年MM月DD日 HH:mm:SS')}`
            ),
    }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
            <span>
                <a href="javascript:void(0)" onClick={() => this.enable(record.id)}>启用</a>
                <span className="ant-divider" />
                <a href="javascript:void(0)" onClick={() => this.disable(record.id)}>禁用</a>
            </span>
            ),
    }];

    add = () => {
        store.dispatch(changeUser({}));
        this.modal.show();
    };

    del = id => {
        if (confirm('确定要删除吗?')) {
            Fetch.del(API_URL.user.del + id).then(() => {
                message.success('删除成功');
                this.loadData();
            });
        }
    };

    enable = id => {
        if (confirm('确定要启用吗?')) {
            Fetch.put(`${API_URL.user.enable + id}`).then(() => {
                message.success('启用成功');
                this.loadData();
            });
        }
    };

    disable = id => {
        if (confirm('确定要禁用吗?')) {
            Fetch.put(`${API_URL.user.disable + id}`).then(() => {
                message.success('禁用成功');
                this.loadData();
            });
        }
    };

    search = () => {
        this.loadData(this.nickname.refs.input.value);
    };

    render() {
        return (
            <div>
                <Header current="user" />
                <div className="groupBuy">
                    <Row>
                        <Col span={4}>
                            <UserSidebar current="user" />
                        </Col>
                        <Col span={20}>
                            <Row>
                                <Col span={8}>
                                    <Form layout="inline">
                                        <FormItem>
                                            <Input name="nickname" placeholder="微信名" ref={com => (this.nickname = com)} />
                                        </FormItem>
                                        <FormItem>
                                            <Button onClick={this.search}>搜索</Button>
                                        </FormItem>
                                    </Form>
                                </Col>
                                {
                                    this.state.role === 'venue' ?
                                        <Col span={16} style={{ textAlign: 'right', paddingRight: '10px' }}>
                                            <Button type="primary" size="large" onClick={this.add}>添加</Button>
                                        </Col> :
                                        null
                                }
                            </Row>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.props.users}
                                del={this.del}
                                rowKey="id"
                                pagination={{ total: this.props.total,　onChange: this.changePage }}
                            />
                        </Col>
                    </Row>

                    <UserFormModal user={this.props.user} reload={this.loadData} ref={com => (this.modal = com)} />
                    <PasswordFormModal user={this.props.user} ref={com => (this.passwordModal = com)} />
                </div>
            </div>
        );
    }
}

class UserForm extends React.Component {
    submit = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log('Errors in form!!!');
                return;
            }
            if (values.id) {
                this.update(values);
            } else {
                this.add(values);
            }
        });
    };

    add = values => {
        Fetch.post(API_URL.user.register, values).then(() => {
            this.props.reload();
            this.props.hide();
        });
    };

    update = values => {
        Fetch.put(`${API_URL.user.update}/${values.id}`, values).then(() => {
            this.props.reload();
            this.props.hide();
        });
    };

    render() {
        const { getFieldProps } = this.props.form;
        let password = '';
        if (!this.props.form.getFieldValue('id')) {
            password = (<FormItem
                label="密码"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
            >
                <Input
                    {...getFieldProps('password', {
                        rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                    })} type="password"
                />
            </FormItem>);
        }
        return (
            <Form layout="horizontal">
                <Input {...getFieldProps('id')} type="hidden" />
                <FormItem
                    label="姓名"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input
                        {...getFieldProps('name', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })} type="text"
                    />
                </FormItem>
                <FormItem
                    label="手机"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input
                        {...getFieldProps('phone', {
                            rules: [{ max: 16, message: '最多16个字符' }, { required: true, message: '必填' }],
                        })} type="text"
                    />
                </FormItem>
                {password}
                <FormItem
                    wrapperCol={{ span: 14, offset: 6 }}
                >
                    <Button type="primary" onClick={this.submit}>保存</Button>
                </FormItem>
            </Form>
        );
    }
}

class UserFormModal extends React.Component {
    state = { visible: false };

    show = () => {
        this.setState({ visible: true });
    };

    hide = () => {
        this.setState({ visible: false });
    };

    render() {
        const title = this.props.user.id ? '修改用户' : '添加用户';

        const mapPropsToFields = () => ({
            id: { value: this.props.user.id },
            phone: { value: this.props.user.phone },
            name: { value: this.props.user.name },
        });

        UserForm = Form.create({ mapPropsToFields })(UserForm);
        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide} footer="">
                <UserForm hide={this.hide} reload={this.props.reload} />
            </Modal>
        );
    }
}

class PasswordForm extends React.Component {
    submit = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log('Errors in form!!!');
                return;
            }
            Fetch.put(`${API_URL.user.reset}/${values.id}`, values).then(() => {
                message.info('修改成功!');
                this.props.hide();
            });
        });
    };

    render() {
        const { getFieldProps } = this.props.form;
        return (
            <Form layout="horizontal">
                <Input {...getFieldProps('id')} type="hidden" />
                <FormItem
                    label="新密码"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input
                        {...getFieldProps('password', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })} type="password"
                    />
                </FormItem>
                <FormItem
                    label="重复密码"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input
                        {...getFieldProps('rePassword', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })} type="password"
                    />
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

class PasswordFormModal extends React.Component {
    state = { visible: false };

    show = () => {
        this.setState({ visible: true });
    };

    hide = () => {
        this.setState({ visible: false });
    };

    render() {
        const mapPropsToFields = () => ({
            id: { value: this.props.user.id },
        });

        PasswordForm = Form.create({ mapPropsToFields })(PasswordForm);
        return (
            <Modal title="重置密码" visible={this.state.visible} onOk={this.submit} onCancel={this.hide} footer="">
                <PasswordForm hide={this.hide} />
            </Modal>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        users: store.userState.users,
        user: store.userState.user,
        total: store.userState.total,
    };
};

export default connect(mapStateToProps)(User);
