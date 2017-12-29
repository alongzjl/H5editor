import React from 'react';
import SkyLight from 'react-skylight';
import Page from '../elements/Page';
import './previewDialog.less';
import disableScroll from './disableScroll';

export default class PreviewDialog extends React.Component {
    state = {
        currentPage: 0,
        refreshAnimation: false,
        next: true,
    };
    show = () => {
        this.previewModal.show();
    };
    hide = () => {
        this.previewModal.hide();
    };
    next = () => {
        if (this.state.refreshAnimation) {
            return;
        }
        const current = this.state.currentPage + 1;
        if (current !== this.props.pages.length) {
            this.setState({
                currentPage: current < this.props.pages.length ? current : this.props.pages.length,
                refreshAnimation: true,
                next: true,
            });
        }
    };
    previous = () => {
        if (this.state.refreshAnimation) {
            return;
        }
        const current = this.state.currentPage - 1;
        this.setState({
            currentPage: current > 0 ? current : 0,
            refreshAnimation: true,
            next: false,
        });
    };
    onAnimationEnd = e => {
        this.finished = this.finished ? (this.finished + 1) : 1;
        if (this.finished === this.started) {
            this.setState({
                refreshAnimation: false,
            });
        }
    };
    onAnimationStart = e => {
        this.started = this.started ? (this.started + 1) : 1;
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
        const animations = [];
        if (this.state.next) {
            animations.push({ trans: 'trans1', scale: 'scale1' });
            animations.push({ trans: 'trans3', scale: 'scale3' });
            animations.push({ trans: 'transBg', scale: 'scaleBg' });
            animations.push({ trans: 'trans2', scale: 'scale2' });
            animations.push({ trans: 'animated4', scale: '' });
        } else {
            animations.push({ trans: 'animated4', scale: '' });
            animations.push({ trans: 'trans33', scale: 'scale33' });
            animations.push({ trans: 'transBg2', scale: 'scaleBg' });
            animations.push({ trans: 'trans22', scale: 'scale22' });
            animations.push({ trans: 'trans4', scale: 'scale4' });
        }
        return (
            <SkyLight
                dialogStyles={previewDialog}
                overlayStyles={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
                ref={com => { this.previewModal = com; }}
                title=""
                {...disableScroll()}
            >
                <div className="previewDialog">
                    <div className="pagepercent">{this.state.currentPage + 1}/{this.props.pages.length}</div>
                    <div className="hideDialog" onClick={this.hide}>退出预览</div>
                    <div className="flex_row_center flex_vertical_bottom">
                        <img className="left" src={require('./images/left.png')} onClick={this.previous} />
                        <div className="flex_row_center flex_vertical_middle" onAnimationEnd={this.onAnimationEnd} onAnimationStart={this.onAnimationStart}>
                            {
                                this.props.pages[this.state.currentPage - 2] && (
                                    <div className={`pages1 ${this.state.refreshAnimation ? animations[0].trans : ''}`}>
                                        <div>
                                            <div className={`preview1 ${this.state.refreshAnimation ? animations[0].scale : ''}`}>
                                                <Page page={this.props.pages[this.state.currentPage - 2]} viewing isTeacher />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                this.props.pages[this.state.currentPage - 1] && (
                                    <div className={`pages3 ${this.state.refreshAnimation ? animations[1].trans : ''}`}>
                                        <div>
                                            <div className={`preview ${this.state.refreshAnimation ? animations[1].scale : ''}`}>
                                                <Page page={this.props.pages[this.state.currentPage - 1]} viewing isTeacher />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            <div className="bg">
                                <div className="overlapTop" />
                                <div className={`bg2 ${this.state.refreshAnimation ? animations[2].trans : ''}`}>
                                    <div className={`currentPage ${this.state.refreshAnimation ? animations[2].scale : ''}`}>
                                        <Page page={this.props.pages[this.state.currentPage]} viewing isTeacher />
                                    </div>
                                </div>
                                <div className="overlapBottom" />
                                <div className="title">{this.props.pages[this.state.currentPage] ? this.props.pages[this.state.currentPage].title : ''}</div>
                            </div>
                            {
                                this.props.pages[this.state.currentPage + 1] && (
                                    <div className={`pages2 ${this.state.refreshAnimation ? animations[3].trans : ''}`}>
                                        <div>
                                            <div className={`preview ${this.state.refreshAnimation ? animations[3].scale : ''}`}>
                                                <Page page={this.props.pages[this.state.currentPage + 1]} viewing isTeacher />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                this.props.pages[this.state.currentPage + 2] && (
                                    <div className={`pages4 ${this.state.refreshAnimation ? animations[4].trans : ''}`}>
                                        <div>
                                            <div className={`preview1 ${this.state.refreshAnimation ? animations[4].scale : ''}`}>
                                                <Page page={this.props.pages[this.state.currentPage + 2]} viewing isTeacher />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <img className="right" src={require('./images/right.png')} onClick={this.next} />
                    </div>
                </div>
            </SkyLight>
        );
    }
}
