import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import common from '../../../common/common';
import t from '../../i18n';
import Noty from '../noty/noty';

export default class DragUpload extends React.Component {
    state = {
        finished: 0,
        length: 0,
    };
    render() {
        const componentConfig = {
            postUrl: this.props.postUrl,
        };
        const djsConfig = {
            params: {
                access_token: common.getAccessToken(),
            },
            // uploadMultiple: true,
            acceptedFiles: this.props.acceptedFiles,
        };
        const eventHandlers = {
            complete: () => {
                Noty.success(t('file_upload_success'));
                this.setState({
                    finished: this.state.finished + 1,
                });
                if (this.state.finished === this.state.length) {
                    this.props.changeSelect();
                }
            },
            canceled: () => {
                this.setState({
                    finished: this.state.finished + 1,
                });
            },
            addedfile: () => {
                this.setState({
                    length: this.state.length + 1,
                });
            },

        };
        return (
            <DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig}>
                <div className="dz-message" data-dz-message><span>或将文件直接拖到此处上传</span></div>
            </DropzoneComponent>
        );
    }
}
