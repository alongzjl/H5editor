/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import Rnd from '../../../common/rnd/ReactRnd';
import store from '../../../../store';
import { changeFocus, changeWordEditable, changeWordText, changeStyle } from '../../../../actions/h5Actions';
import getPosition from '../getPosition';
import API_URL from '../../../../common/url';
import {adjustLine,cancelLine} from './lineShow';
import './lineQuestion.less';

export default class LineQuestion extends React.Component {
    state = {
        index: 0,
    };
    onClicked = e => {
        e.stopPropagation();
        e.preventDefault();
        store.dispatch(changeFocus(this.props.value));
    };
    drawLine = () => {
        adjustLine(
            this.props.value,
            this.props.to
         );
    };
    changeEditable = () => {
        store.dispatch(changeWordEditable(this.props.value.id, true));
      // store.dispatch(changeStyle({ height: 'auto' }));
        store.dispatch(changeStyle({ minHeight: this.props.value.style.height }));
    };
    changeEditableFalse = () => {
        store.dispatch(changeWordEditable(this.props.value.id, false));
    };
    changeText = e => {
        store.dispatch(changeWordText(this.props.value.id, e.target.innerHTML));
    };
    handleBlur = e => {
        this.changeEditableFalse();
        this.changeText(e);
    };

    longClick = () => {
        this.timer = setTimeout(this.props.showImage, 1000);
    };
    cancelLongClick = e => {
        clearTimeout(this.timer);
         e && e.preventDefault();
    };
    rightClick = () => {
        this.cancelLongClick();
        store.dispatch(changeFocus(this.props.value));
    };
    onAnimationEnd = () => {
        this.setState({
            index: this.state.index + 1,
        });
    };
   
    componentWillReceiveProps() {
        if (this.state.index === this.props.value.animations.length) {
            this.setState({
                index: 0,
            });
        }
    }
    render() {
        const { value, focusId,isTeacher } = this.props;
        let animation = {};
        if (value.animations.length > this.state.index) {
            animation = value.animations[this.state.index];
        }
        const style = Object.assign({}, value.style, {
            animationDelay: animation.animationDelay,
            animationDuration: animation.animationDuration,
            animationIterationCount: animation.animationIterationCount,
        });
     return (
            <Rnd
                onDragStart={this.onClicked}
                onDrag={e => {this.cancelLongClick(e)}}
                className={focusId === value.id ? 'focused' : ''}
                isDraggable={!value.contenteditable}
                style={value.style}
                onDoubleClick={this.changeEditable}
                initial={{...getPosition(value.style), width: style.width, height: style.height}}
            >
                <div
                    className={(focusId === value.id || focusId === -1) ? `${animation.className} lineQuestion` : 'lineQuestion'}
                    style={{ ...style, left: 'auto', top: 'auto' }}
                    onMouseOver={this.drawLine}
                    onMouseOut={cancelLine}
                    onMouseDown={this.longClick}
                    onContextMenu={this.rightClick}
                    onBlur={this.handleBlur}
                    onMouseUp={e => {this.cancelLongClick(e)}}
                    onAnimationEnd={this.onAnimationEnd}
                >
                    <span>{value.num}</span>
                    {
                        value.src ? <img src={API_URL.upload + value.src} alt="" width="100%" /> : <div contentEditable={value.contenteditable} dangerouslySetInnerHTML={{ __html: value.text }} />
                    }
                </div>
            </Rnd>
        );
    }
}

