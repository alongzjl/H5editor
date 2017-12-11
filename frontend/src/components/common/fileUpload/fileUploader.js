import React from 'react';
import FileUpload from 'react-fileupload';
import common from '../../../common/common';

export default class FileUploader extends React.Component {
    render() {
        const options = {
            dataType: 'json',
            chooseAndUpload: true,
            accept: 'image/*',
            multiple: false,
            fileFieldName: 'file',
            maxSize: '1MB',
            paramAddToField: { access_token: common.getAccessToken(), isPublic: false },
        };
        return (
            <FileUpload options={Object.assign({}, options, this.props.options)}>
                {this.props.children}
            </FileUpload>
        );
    }
}
