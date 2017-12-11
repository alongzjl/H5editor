import React from 'react';
import { Button, Form, Input } from 'antd';
import { connect } from 'react-redux';
import Fetch from '../../../common/FetchIt';
import API_URL from '../../../common/url';

const FormItem = Form.Item;

class TagForm extends React.Component {
    submit = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                return;
            }
            Fetch.post(`${API_URL.post.tag}`, values).then(() => {
                this.props.hide();
                this.props.refresh();
            });
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form horizontal>
                {getFieldDecorator('postId')(<Input type="hidden" />)}
                <FormItem
                    label="标签"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    {getFieldDecorator('name', {
                        rules: [{ max: 16, message: '最多16个字符' }, { required: true, message: '必填' }],
                    })(
                        <Input type="text" />,
                    )}
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 14, offset: 6 }}
                >
                    <Button type="primary" onClick={this.submit}>保存</Button> <Button onClick={() => this.props.hide()}>取消</Button>
                </FormItem>
            </Form>
        );
    }
}

class TagItem extends React.Component {
    del = () => {
        Fetch.del(`${API_URL.post.del}${this.props.postId}/tag/${this.props.tag.id}`).then(() => {
            this.props.refresh();
        });
    };

    render() {
        return (
            <div key={this.props.tag.id}>
                <div>{this.props.tag.name}</div>
                <div><Button onClick={this.del}>删除</Button></div>
            </div>
        );
    }
}

class Tag extends React.Component {
    state = {
        tags: [],
    };

    componentDidMount = () => {
        this.loadData(this.props.postId);
    };

    loadData = postId => {
        if (postId) {
            Fetch.get(`${API_URL.post.tags}${postId}`).then(tags => {
                if (tags) {
                    this.setState({ tags });
                }
            });
        }
    };

    reload = () => {
        this.loadData(this.props.postId);
    };

    add = () => {
        this.setState({ add: true });
    };

    hide = () => {
        this.setState({ add: false });
    };

    render() {
        const mapPropsToFields = () => ({
            postId: { value: this.props.postId },
        });

        TagForm = Form.create({ mapPropsToFields })(TagForm);
        return (
            <div>
                {this.state.add ? <TagForm hide={this.hide} refresh={this.reload} /> : <Button onClick={this.add}>添加</Button>}
                {
                    this.state.tags.map(tag => <TagItem tag={tag} postId={this.props.postId} refresh={this.reload} />)
                }
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        postId: store.postState.post.id,
    };
};

export default connect(mapStateToProps)(Tag);
