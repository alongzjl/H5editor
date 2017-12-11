/**
 * Created by sunlong on 16/12/28.
 */
import React from 'react';
import { Button, Modal, Form, Input } from 'antd';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';

const FormItem = Form.Item;

class CategoryForm extends React.Component {
    submit = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log('Errors in form!!!');
                return;
            }
            if (values.id) {
                this.update(values);
            } else {
                this.save(values);
            }
        });
    };

    save = values => {
        Fetch.postJSON(API_URL.category.add, { body: JSON.stringify(values) }).then(() => {
            this.props.hide();
            this.props.reload();
        });
    };

    update = values => {
        Fetch.putJSON(`${API_URL.category.update}/${values.id}`, { body: JSON.stringify(values) }).then(() => {
            this.props.hide();
            this.props.reload();
        });
    };

    render = () => {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form horizontal>
                {getFieldDecorator('id')(<Input type="hidden" />)}
                {getFieldDecorator('parent_id')(<Input type="hidden" />)}
                {getFieldDecorator('type')(<Input type="hidden" />)}
                <FormItem
                    label="分类名称"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                >
                    {
                        getFieldDecorator('name', {
                            rules: [{ required: true, message: '必填' }],
                        })(
                            <Input type="text" />,
                        )
                    }
                </FormItem>
                <FormItem
                    label="序号"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                >
                    {
                        getFieldDecorator('categoryNo', {
                            rules: [{ required: true, message: '必填' }],
                        })(
                            <Input type="text" />,
                        )
                    }
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 18, offset: 4 }}
                >
                    <Button type="primary" onClick={this.submit}>确定</Button>
                </FormItem>
            </Form>
        );
    }
}

export default class CategoryFormModal extends React.Component {
    state = { visible: false };

    show = () => {
        this.setState({ visible: true });
    };

    hide = () => {
        this.setState({ visible: false });
    };

    render() {
        if (!this.state.visible) {
            return null;
        }
        const mapPropsToFields = () => ({
            id: { value: this.props.category.id },
            name: { value: this.props.category.name },
            categoryNo: { value: this.props.category.categoryNo },
            parent_id: { value: this.props.category.parent_id },
            type: { value: this.props.type },
        });

        const NewForm = Form.create({ mapPropsToFields })(CategoryForm);
        return (
            <Modal title="编辑" visible={this.state.visible} onOk={this.hide} onCancel={this.hide} footer="">
                <NewForm hide={this.hide} reload={this.props.reload} />
            </Modal>
        );
    }
}
