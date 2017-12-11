import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Modal, Form, Input, message, Select, Col, Row, Popconfirm } from 'antd';
import Fetch from '../../../common/FetchIt';
import store from '../../../store';
import API_URL from '../../../common/url';
import { changeImages, changeImage } from '../../actions/imageActions';
import Header from '../../../common/header/Header';
import FileUploader from '../../../common/uploader/FileUploader';
import './image.less';
import Sidebar from './Sidebar';

const FormItem = Form.Item;
const Option = Select.Option;

class ImageForm extends React.Component {
    state = {
        categories: [],
    };
    update = values => {
        this.filter(values);
        Fetch.putJSON(`${API_URL.image.update}/${values.id}`, { body: JSON.stringify(values) }).then(() => {
            message.info('修改成功!');
            this.props.reload();
            this.props.hide();
        });
    };

    add = values => {
        this.filter(values);
        Fetch.post(`${API_URL.image.add}`, values).then(() => {
            message.info('添加成功!');
            this.props.reload();
            this.props.hide();
        });
    };

    filter = values => {
        const ids = values.pic.map(image => {
            const { id } = image;
            return id;
        });
        delete values.pic;
        values.ids = ids;
    };

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

    componentDidMount() {
        Fetch.get(`${API_URL.category.list}?type=image`).then(categories => {
            this.setState({
                categories,
            });
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="horizontal">
                {getFieldDecorator('id')(<Input type="hidden" />)}
                <FormItem
                    label="分类"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('categoryId', {
                            rules: [{ required: true, message: '必填' }],
                        })(
                            <Select>
                                {
                                    this.state.categories.map(category => (<Option key={category.id} value={`${category.id}`}>{category.name}</Option>))
                                }
                            </Select>,
                        )
                    }
                </FormItem>
                <FormItem
                    label="图片"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('pic', {
                            valuePropName: 'fileList',
                            rules: [{ required: true, message: '必填', type: 'array' }],
                        })(
                            <FileUploader />,
                        )
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

class ImageFormModal extends React.Component {
    state = { visible: false };

    show=() => {
        this.setState({ visible: true });
    };

    hide=() => {
        this.setState({ visible: false });
    };

    render() {
        const title = this.props.image.id ? '修改图片' : '添加图片';

        const mapPropsToFields = () => {
            const pic = [];
            if (this.props.image.id) {
                pic.push({
                    name: this.props.image.name,
                    url: this.props.image.path,
                    uid: this.props.image.id,
                    status: 'done',
                });
            }

            return {
                id: { value: this.props.image.id },
                pic: { value: pic },
                categoryId: { value: this.props.image.category ? this.props.image.category.id : undefined },
            };
        };

        ImageForm = Form.create({ mapPropsToFields })(ImageForm);

        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide} footer="">
                <ImageForm ref="form" hide={this.hide} reload={this.props.reload} />
            </Modal>
        );
    }
}

class Image extends React.Component {
    componentDidMount = () => {
        this.loadData();
    };

    loadData = (page = 1) => {
        Fetch.get(`${API_URL.image.list}?page=${page}&categoryId=0&isPublic=true`).then(data => {
            store.dispatch(changeImages(data.content, data.totalElements));
        });
    };

    changePage = page => {
        this.loadData(page);
    };
    getColumns = () => [{
        title: '所属分类',
        key: 'category',
        render: (text, record) => record.category ? record.category.name : '',
    }, {
        title: '缩略图',
        dataIndex: 'path',
        key: 'path',
        render: text => <img src={`${API_URL.upload+text}`} width="50" />,
    }, {
        title: '创建时间',  
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (text, record) => record.createdDate ? new Date(record.createdDate).toLocaleString() : '',
    }, {
        title: '操作',
        render: (text, record) => (
            <Popconfirm title={'确定要删除吗?'} onConfirm={this.del.bind(this, record.id)} okText="确定" cancelText="取消">
                <a href="javascript:void(0)">删除</a>
            </Popconfirm>
        ),
    }];

    add = () => {
        store.dispatch(changeImage({ groups: 1 }));
        this.modal.show();
    };

    del = id => {
        Fetch.del(`${API_URL.image.del}${id}`).then(() => {
            message.success('删除成功');
            this.loadData();
        });
    };

    render() {
        return (
            <div>
                <Header current="image" />
                <div className="groupBuy">
                    <Row>
                        <Col span={4}>
                            <Sidebar current="image" />
                        </Col>
                        <Col span={20}>
                            <Button type="primary" size="large" onClick={this.add}>添加</Button>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.props.images}
                                rowKey="id"
                                pagination={{ total: this.props.total, onChange: this.changePage }}
                            />
                            <ImageFormModal image={this.props.image} reload={this.loadData} ref={com => this.modal = com} />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        images: store.imageState.images,
        image: store.imageState.image,
        total: store.imageState.total,
    };
};

export default connect(mapStateToProps)(Image);
