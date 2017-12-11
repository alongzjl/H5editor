import React from 'react';
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Table } from 'antd';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';
import Header from '../../../common/header/Header';
import Sidebar from './Sidebar';
import FileUploader from '../../../common/uploader/FileUploader';

const FormItem = Form.Item;

class CategoryForm extends React.Component {
    submit = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log('Errors in form!!!');
                return;
            }
            this.filter(values);
            if (values.id) {
                Fetch.putJSON(`${API_URL.category.update}/${values.id}`, { body: JSON.stringify(values) }).then(() => {
                    this.props.reload();
                    this.props.hide();
                });
            } else {
                Fetch.postJSON(`${API_URL.category.add}`, { body: JSON.stringify(values) }).then(() => {
                    this.props.reload();
                    this.props.hide();
                });
            }
        });
    };

    filter = values => {
        const { name, url, uid, status } = values.cover[0];
        values.cover = JSON.stringify([{ name, url, uid, status }]);
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="horizontal">
                { getFieldDecorator('id')(<Input type="hidden" />) }
                <FormItem
                    label="分类名"
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
                    label="分类图片"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('cover', {
                            rules: [{ required: true, message: '必填', type: 'array' }],
                        })(<FileUploader multiple={false} />)
                    }
                </FormItem>
                <FormItem
                    label="排序序号"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('categoryNo', {
                        })(<InputNumber min={0} max={100000} />)
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

class CategoryFormModal extends React.Component {
    state = { visible: false };

    show = () => {
        this.setState({ visible: true });
    };

    hide = () => {
        this.setState({ visible: false });
    };

    render() {
        const title = this.props.category.id ? '修改分类' : '添加分类';
        const cover = this.props.category.cover ? JSON.parse(this.props.category.cover) : [];
        const mapPropsToFields = () => ({
            id: { value: this.props.category.id },
            name: { value: this.props.category.name },
            categoryNo: { value: this.props.category.categoryNo },
            cover: { value: cover },
        });

        const NewCategoryForm = Form.create({ mapPropsToFields })(CategoryForm);
        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide} footer="">
                <NewCategoryForm ref="form" hide={this.hide} reload={this.props.reload} />
            </Modal>
        );
    }
}

class Category extends React.Component {
    state = {
        categories: [],
        category: {},
    };
    componentDidMount = () => {
        this.loadData(1);
    };

    loadData = () => {
        Fetch.get(API_URL.category.list).then(data => {
            this.setState({
                categories: data,
            });
        });
    };

    getColumns = () => [{
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '序号',
        dataIndex: 'categoryNo',
        key: 'categoryNo',
    }, {
        title: '图片',
        dataIndex: 'cover',
        key: 'cover',
        render: text => {
            const image = JSON.parse(text)[0];
            const src = image && image.url ? image.url : '';
            return <img src={src} alt="缩略图" />;
        },
    }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
            <span>
                <a href="javascript:void(0)" onClick={() => this.update(record)}>编辑</a>
                <span className="ant-divider" />
                <a href="javascript:void(0)" onClick={() => this.del(record.id)}>删除</a>
            </span>
            ),
    }];

    del = id => {
        if (confirm('确定要删除吗?')) {
            Fetch.del(API_URL.category.del + id).then(() => {
                message.success('删除成功');
                this.loadData();
            });
        }
    };

    add = () => {
        this.setState({ category: {} }, () => {
            this.refs.modal.show();
        });
    };
    update = category => {
        this.setState({ category }, () => {
            this.refs.modal.show();
        });
    };
    render() {
        return (
            <div>
                <Header current="category" />
                <div className="groupBuy">
                    <Row>
                        <Col span={4}>
                            <Sidebar current="2" />
                        </Col>
                        <Col span={20}>
                            <Button type="primary" size="large" onClick={this.add}>添加</Button>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.state.categories}
                                pagination=""
                            />
                            <CategoryFormModal category={this.state.category} reload={this.loadData} ref="modal" />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}


export default Category;
