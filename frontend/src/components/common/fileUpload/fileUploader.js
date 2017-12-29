import React from 'react';
import Upload from 'rc-upload';
import common from '../../../common/common';
import noty from '../../common/noty/noty';

export default class FileUploader extends React.Component {
    render() {
        return (
            <Upload
                action={this.props.url}
                data={{ isPublic: false, access_token: common.getAccessToken() }}
                // headers={{ Authorization: `Bearer: ${common.getAccessToken()}` }}
                multiple={!!this.props.multiple}
                onSuccess={() => this.props.onSuccess && this.props.onSuccess()}
                onStart={() => this.props.onStart && this.props.onStart()}
                onError={() => { noty.error('上传失败'); this.props.onError && this.props.onError(); }}
                name="file"
                accept={this.props.accept}
            >
                {this.props.children}
            </Upload>
        );
    }
}
