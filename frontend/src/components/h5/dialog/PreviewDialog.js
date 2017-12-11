import React from 'react';
import SkyLight from 'react-skylight';
import Page from '../elements/Page';
import './previewDialog.less';

export default class PreviewDialog extends React.Component {
    state = {
        currentPage: 0,
    };
    show = () => {
        this.previewModal.show();
    };
    hide = () => {
        this.previewModal.hide();
    };
    next = () => {
        const current = this.state.currentPage + 1;
        if (current !== this.props.pages.length) {
            this.setState({
                currentPage: current < this.props.pages.length ? current : this.props.pages.length,
            });
        }
    };
    previous = () => {
        const current = this.state.currentPage - 1;
        this.setState({
            currentPage: current > 0 ? current : 0,
        });
    };
    render() {
        const previewDialog = {
            height: 'auto',
            minHeight: '320px',
            width: '900px',
            margin: '0 auto',
            left: 0,
            right: 0,
            top: '60px',
            backgroundColor: 'rgba(0,0,0,0)',
        };
        return (
            <SkyLight
                dialogStyles={previewDialog}
                overlayStyles={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
                ref={com => { this.previewModal = com; }}
                title=""
            >
                <div className="previewDialog">
                    <div className="hideDialog" onClick={this.hide}>退出预览</div>
                    <div className="flex_row_center flex_vertical_bottom">
                        <img className="left" src={require('./images/left.png')} onClick={this.previous} />
                        <div className="flex_row_center flex_vertical_middle">
                            <div className="flex_row_end pages1">
                                {
                                    this.props.pages.slice(this.state.currentPage - 2 < 0 ? 0 : this.state.currentPage - 2, this.state.currentPage).map(page => (
                                        <div key={page.id}><div className="preview"><Page page={page} viewing isTeacher /></div></div>
                                    ))
                                }
                            </div>
                            <div className="bg">
                                <div className="currentPage"><Page page={this.props.pages[this.state.currentPage]} viewing isTeacher /></div>
                            </div>
                            <div className="flex_row_between pages2">
                                {
                                    this.props.pages.slice(this.state.currentPage + 1, this.state.currentPage + 3).map(page => (
                                        <div key={page.id}><div className="preview"><Page page={page} viewing isTeacher /></div></div>
                                    ))
                                }
                            </div>
                        </div>
                        <img className="right" src={require('./images/right.png')} onClick={this.next} />
                    </div>
                </div>
            </SkyLight>
        );
    }
}
