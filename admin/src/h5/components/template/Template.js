import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Table, Button, Modal, Form, Input, message, Row, Col, InputNumber, Upload, Icon, Select } from 'antd';
import { listTemplates, changeTemplate } from '../../actions/templateActions';
import Header from '../../../common/header/Header';
import Fetch from '../../../common/FetchIt';
import store from '../../../store';
import API_URL from '../../../common/url';
import Sidebar from './Sidebar';
import SimditorTextarea from '../../../common/SimditorTextarea';
import Price from './Price';
import './price.less';

const FormItem = Form.Item;
const Option = Select.Option;

class TemplateForm extends React.Component {
    state = {
        categories: [],
    };
    submit = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
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
        this.filter(values);
        Fetch.postJSON(API_URL.template.add, { body: JSON.stringify(values) }).then(() => {
            this.props.reload();
            this.props.hide();
        });
    };

    update = values => {
        this.filter(values);
        Fetch.putJSON(`${API_URL.template.update}/${values.id}`, { body: JSON.stringify(values) }).then(() => {
            this.props.reload();
            this.props.hide();
        });
    };

    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return this.handleUpload(e);
    };

    handleUpload = info => {
        if (!info || info.fileList.length === 0) {
            return [];
        }

        const response = info.file.response;
        if (response) {
            if (response.success) {
                return [{ name: info.file.response.data, uid: info.file.uid, status: info.file.status }];
            }
            message.error(response.msg);
            return [];
        }
        return [info.file];
    };

    filter = values => {
        if (values.picture && values.picture.length > 0) {
            values.picture = values.picture[0].name;
        }
        if (values.thumbnail && values.thumbnail.length > 0) {
            values.thumbnail = values.thumbnail[0].name;
        }
    };

    componentDidMount = () => {
        Fetch.get(API_URL.category.list).then(categories => { this.setState({ categories }); });
    };

    checkPrice = (rule, prices, callback) => {
        const error = prices.some(price => (price.name === '' || price.fee === '' || price.vipFee === ''));
        if (error) {
            callback('价格不能为空');
        } else {
            callback();
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const options = this.state.categories.map(category => <Option key={category.id} value={`${category.id}`}>{category.name}</Option>);
        return (
            <Form layout="horizontal">
                { getFieldDecorator('id')(<Input type="hidden" />) }
                <FormItem
                    label="分类"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('category.id', {
                            rules: [{ required: true, message: '必填' }],
                        })(
                            <Select>{options}</Select>,
                        )
                    }
                </FormItem>
                <FormItem
                    label="名称"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('name', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })(<Input type="text" />)
                    }
                </FormItem>
                <FormItem
                    label="营业时间"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('workDate', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })(<Input type="text" />)
                    }
                </FormItem>
                <FormItem
                    label="活动要求"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('requirement', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })(<Input type="text" />)
                    }
                </FormItem>
                <FormItem
                    label="电话"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('phone', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })(<Input type="text" />)
                    }
                </FormItem>
                <FormItem
                    label="客服"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('csPhone', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })(<Input type="text" />)
                    }
                </FormItem>
                <FormItem
                    label="备注"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('note', {
                            rules: [{ max: 32, message: '最多32个字符' }, { required: true, message: '必填' }],
                        })(<Input type="text" />)
                    }
                </FormItem>
                <FormItem
                    label="详情"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('content', {
                            rules: [{ max: 65565, message: '最多65565个字符' }, { required: true, message: '必填' }],
                        })(<SimditorTextarea />)
                    }
                </FormItem>
                <FormItem
                    label="活动地址"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('location', {
                            rules: [{ max: 128, message: '最多128个字符' }, { required: true, message: '必填' }],
                        })(<Input type="text" />)
                    }
                </FormItem>
                <FormItem
                    label="数量"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('num', {
                            rules: [{ required: true, message: '必填' }],
                        })(<InputNumber min={1} max={100000000} />)
                    }
                </FormItem>
                <FormItem
                    label="缩略图"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('thumbnail', {
                            valuePropName: 'fileList',
                            normalize: this.normFile,
                            rules: [{ required: true, message: '必填', type: 'array' }],
                        })(
                            <Upload
                                name="file"
                                action={API_URL.upload}
                                listType="picture"
                                data={{ access_token: sessionStorage.token }}
                            >
                                <Button type="ghost">
                                    <Icon type="upload" /> 上传
                                </Button>
                            </Upload>,
                        )
                    }
                </FormItem>
                <FormItem
                    label="大图"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('picture', {
                            valuePropName: 'fileList',
                            normalize: this.normFile,
                            rules: [{ required: true, message: '必填', type: 'array' }],
                        })(
                            <Upload
                                name="file"
                                action={API_URL.upload}
                                listType="picture"
                                data={{ access_token: sessionStorage.token }}
                            >
                                <Button type="ghost">
                                    <Icon type="upload" /> 上传
                                </Button>
                            </Upload>,
                        )
                    }
                </FormItem>
                <FormItem
                    label="费用"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('prices', {
                            rules: [{ type: 'array', required: true, validator: this.checkPrice }],
                        })(<Price />)
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

class TemplateFormModal extends React.Component {
    state = { visible: false };

    show = () => {
        this.setState({ visible: true });
    };

    hide = () => {
        this.setState({ visible: false });
    };

    render() {
        const title = this.props.template.id ? '修改活动' : '添加活动';
        const categoryId = this.props.template.category ? `${this.props.template.category.id}` : '';
        const mapPropsToFields = () => {
            const picture = this.props.template.picture ? [{ name: this.props.template.picture, uid: this.props.template.picture }] : [];
            const thumbnail = this.props.template.thumbnail ? [{ name: this.props.template.thumbnail, uid: this.props.template.thumbnail }] : [];
            const prices = this.props.template.prices ? this.props.template.prices : [{ name: '', fee: '', note: '', vipFee: '' }];
            return {
                id: { value: this.props.template.id },
                name: { value: this.props.template.name },
                content: { value: this.props.template.content },
                userId: { value: this.props.template.userId },
                endDate: { value: moment(this.props.template.endDate) },
                startDate: { value: moment(this.props.template.startDate) },
                workDate: { value: this.props.template.workDate },
                requirement: { value: this.props.template.requirement },
                phone: { value: this.props.template.phone },
                csPhone: { value: this.props.template.csPhone },
                note: { value: this.props.template.note },
                picture: { value: picture },
                thumbnail: { value: thumbnail },
                location: { value: this.props.template.location },
                num: { value: this.props.template.num },
                'category.id': { value: categoryId },
                prices: { value: prices },
            };
        };

        TemplateForm = Form.create({ mapPropsToFields })(TemplateForm);
        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide} width={1100} footer="">
                <TemplateForm ref="form" hide={this.hide} reload={this.props.reload} />
            </Modal>
        );
    }
}

class Template extends React.Component {
    changePage = page => {
        this.loadData(page);
    };

    componentDidMount = () => {
        this.loadData(1);
    };

    loadData = (page = 1) => {
        Fetch.get(`${API_URL.template.list}?page=${page}`).then(data => {
            store.dispatch(listTemplates(data.content, data.totalElements));
        });
    };

    recommend = record => {
        Fetch.put(`${API_URL.template.recommend}?id=${record.id}&recommend=${!record.recommend}`).then(() => {
            this.loadData();
        });
    };

    getColumns = () => [{
        title: '模板名',
        dataIndex: 'name',
        width: '18%',
    }, {
        title: '模板分类',
        dataIndex: 'childGroupName',
    }, {
        title: '创建时间',
        dataIndex: 'createdDate',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
            <span>
                <a href="javascript:void(0)" onClick={() => this.del(record.id)}>删除</a>
            </span>
            ),
    }];

    add = () => {
        location.href = `${API_URL.www}#/builder?from=admin&isPublic=true&token=${sessionStorage.getItem('token')}`;
    };

    del = id => {
        if (confirm('确定要删除吗?')) {
            Fetch.del(API_URL.template.del + id).then(() => {
                message.success('删除成功');
                this.loadData();
            });
        }
    };

    render() {
        return (
            <div>
                <Header current="template" />
                <div className="groupBuy">
                    <Row>
                        <Col span={4}>
                            <Sidebar current="1" />
                        </Col>
                        <Col span={20}>
                            <Button type="primary" size="large" onClick={this.add}>添加</Button>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.props.templates}
                                rowKey="id"
                                del={this.del}
                                pagination={{ total: this.props.total, onChange: this.changePage }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        templates: store.templateState.templates,
        template: store.templateState.template,
        total: store.templateState.total,
    };
};

export default connect(mapStateToProps)(Template);
