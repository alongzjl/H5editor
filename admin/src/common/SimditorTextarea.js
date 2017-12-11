import React from "react";
import Simditor from "simditor";
import $ from "jquery";
import { message } from 'antd';
import API_URL from "../common/url";
require("simditor/styles/simditor.css");

const SimditorTextarea =  React.createClass({
    componentDidMount: function() {
        this.initEditor();
    },

    initEditor: function () {
        let config = {
            placeholder: '',
            defaultImage: 'images/image.png',
            params: {},
            upload: {
                url: API_URL.upload,
                fileKey: 'file',
            },
            tabIndent: true,
            toolbar: [
                'title',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'fontScale',
                'color',
                'ol',
                'ul',
                'indent',
                'outdent',
                'alignment',
                'image',
            ],
            toolbarFloat: true,
            toolbarFloatOffset: 0,
            toolbarHidden: false,
            pasteImage: false,
            cleanPaste: false,
            textarea: $(this.refs.textarea),
        };

        this.editor = new Simditor(config);
        this.editor.setValue(this.props.value?this.props.value:'');
        this.editor.on('valuechanged', this.onChange);

        this.editor.uploader.on('beforeupload', function (e, file) {
            if(file.size > 5*1024*1024){
                message.error("图片大小不能超过5m");
                $("img.uploading").remove();
                return false;
            }
            return true;
        });

        this.editor.uploader.on('uploadsuccess', function (uploader, file, result) {
            if(!result.success){
                message.error("图片上传失败:"+ result.msg);
                $("img.uploading").remove();
            }
        });
    },
    onChange: function(e) {
        this.props.onChange(this.editor.getValue().trim());
    },
    getValue: function () {
        return this.editor.getValue().trim();
    },
    render: function () {
        return (
            <textarea ref="textarea" className={this.props.className} />
        )
    }
});

export default SimditorTextarea;
