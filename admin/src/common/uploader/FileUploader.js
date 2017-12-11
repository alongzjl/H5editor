/**
 * Created by sunlong on 16/12/28.
 */
import React from 'react';
import { Button, Icon, Upload } from 'antd';
import API_URL from '../../common/url';

export default class FileUploader extends React.Component {
    state = {
        fileList: this.props.fileList ? this.props.fileList : [],
    };

    handleUpload = info => {
        let fileList = info.fileList;
        if (!this.props.multiple) {
            fileList = fileList.slice(-1);
        }

        // 2. read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                file.id = file.response.id;
                file.url = API_URL.domain + file.response.data;
            }
            return file;
        });

        // 3. filter successfully uploaded files according to response from server
        fileList = fileList.filter(file => {
            if (file.response) {
                return file.response.success;
            }
            return true; 
        });
        this.setState({ fileList });
        return fileList;
    };

    onChange = info => {
    	this.props.onChange(this.handleUpload(info));
    };

    componentWillReceiveProps = nextProps => {
        if (nextProps.fileList) {
            this.setState({
                fileList: nextProps.fileList,
            });
        }
    };

    render() {
        return (
            <Upload
                name="file"
                multiple={!!this.props.multiple}
                action={`${API_URL.upload}/image`}
                listType="picture"
                accept="image/*"
                data={{ access_token: sessionStorage.token }}
                onChange={this.onChange}
                fileList={this.state.fileList}
            >
                <Button type="ghost">
                    <Icon type="upload" /> 上传
                </Button>
            </Upload>
        );
    }
}
