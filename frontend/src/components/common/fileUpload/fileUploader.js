import React from 'react';
import Upload from 'rc-upload';
import common from '../../../common/common';
import noty from '../../common/noty/noty';

export default class FileUploader extends React.Component {
    state = {
        finished: 0,
        length: 0,
    };
    render() {
        return (
            <Upload
                action={this.props.url}
                data={{ isPublic: false, access_token: common.getAccessToken() }}
                // headers={{ Authorization: `Bearer: ${common.getAccessToken()}` }}
                multiple={!!this.props.multiple}
                onSuccess={() => {
                    this.setState({
                        finished: this.state.finished + 1,
                    });
                    if (this.state.finished === this.state.length && this.props.onSuccess) {
                         this.props.onSuccess();
                    }
                }}
                onStart={() => {
                    this.setState({
                        length: this.state.length + 1,
                    });
                    this.props.onStart && this.props.onStart();
                }}
                onError={() => {
                    this.setState({
                        finished: this.state.finished + 1,
                    });
                    noty.error('上传失败');
                    this.props.onError && this.props.onError();
                }}
                name="file"
                accept={this.props.accept}
            >
                {this.props.children}
            </Upload>
        );
    }
}
