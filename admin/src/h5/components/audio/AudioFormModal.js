/**
 * Created by sunlong on 16/12/28.
 */
import React from 'react';
import { Button, Modal, Form, Select, message, Icon, Upload } from 'antd';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';

const FormItem = Form.Item;
const Option = Select.Option;

class AudioForm extends React.Component {
    state = {
        categories: [],
    };

    submit = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log('Errors in form!!!');
                return;
            }
            this.save(values);
        });
    };

    save = values => {
        this.filter(values);
        Fetch.post(API_URL.audio.add, values).then(() => {
            this.props.hide();
            this.props.reload();
        });
    };

    filter = values => {
        const ids = values.audios.map(audio => {
            const { id } = audio;
            return id;
        });
        delete values.audios;
        values.ids = ids;
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
                info.fileList.map(file => {
                    if (file.uid === info.file.uid) {
                        file.id = info.file.response.id;
                        file.name = info.file.response.data;
                    }
                });
            } else {
                message.error(response.msg);
            }
        }

        return info && info.fileList;
    };

    componentDidMount() {
        Fetch.get(`${API_URL.category.list}?type=audio`).then(categories => {
            this.setState({
                categories,
            });
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form layout="horizontal">
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
                    label="音频"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {
                        getFieldDecorator('audios', {
                            valuePropName: 'fileList',
                            normalize: this.normFile,
                        })(
                            <Upload
                                name="file"
                                multiple
                                action={`${API_URL.upload}music`}
                                accept="audio/*"
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
                    wrapperCol={{ span: 14, offset: 6 }}
                >
                    <Button type="primary" onClick={this.submit}>确定</Button>
                </FormItem>
            </Form>
        );
    }
}

export default class AudioFormModal extends React.Component {
    state = { visible: false };

    show = () => {
        this.setState({ visible: true });
    };

    hide = () => {
        this.setState({ visible: false });
    };

    render() {
        const title = this.props.audio.id ? '修改音频' : '添加音频';
        AudioForm = Form.create({ })(AudioForm);
        return (
            <Modal title={title} visible={this.state.visible} onOk={this.submit} onCancel={this.hide} footer="">
                <AudioForm hide={this.hide} reload={this.props.reload} />
            </Modal>
        );
    }
}
