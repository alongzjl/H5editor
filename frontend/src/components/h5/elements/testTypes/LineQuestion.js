/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import Rnd from '../../../common/rnd/ReactRnd';
import store from '../../../../store';
import { changeFocus, changeWordEditable, changeWordText, changeStyle } from '../../../../actions/h5Actions';
import getPosition from '../getPosition';
import API_URL from '../../../../common/url';
import './lineQuestion.less';

export default class LineQuestion extends React.Component {
    onClicked = e => {
        e.stopPropagation();
        store.dispatch(changeFocus(this.props.value));
    };
    drawLine = () => {
        this.adjustLine(
            this.props.value,
            this.props.to,
            document.getElementById('line'),
        );
    };
    changeEditable = () => {
        store.dispatch(changeWordEditable(this.props.value.id, true));
        store.dispatch(changeStyle({ height: 'auto' }));
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
    cancelLine = () => {
        document.getElementById('line').style.visibility = 'hidden';
    };
    adjustLine = (from, to, line) => {
        const fT = parseInt(from.style.top) + parseInt(from.style.height) / 2;
        const tT = parseInt(to.style.top) + parseInt(to.style.height) / 2;
        const fL = parseInt(from.style.left) + parseInt(from.style.width) / 2;
        const tL = parseInt(to.style.left) + parseInt(to.style.width) / 2;
        const CA = Math.abs(tT - fT);
        const CO = Math.abs(tL - fL);
        const H = Math.sqrt(CA * CA + CO * CO);
        let ANG = 180 / Math.PI * Math.acos(CA / H);

        if (tT > fT) {
            var top = (tT - fT) / 2 + fT;
        } else {
            var top = (fT - tT) / 2 + tT;
        }
        if (tL > fL) {
            var left = (tL - fL) / 2 + fL;
        } else {
            var left = (fL - tL) / 2 + tL;
        }

        if ((fT < tT && fL < tL) || (tT < fT && tL < fL) || (fT > tT && fL > tL) || (tT > fT && tL > fL)) {
            ANG *= -1;
        }
        top -= H / 2;

        line.style['-webkit-transform'] = `rotate(${ANG}deg)`;
        line.style['-moz-transform'] = `rotate(${ANG}deg)`;
        line.style['-ms-transform'] = `rotate(${ANG}deg)`;
        line.style['-o-transform'] = `rotate(${ANG}deg)`;
        line.style['-transform'] = `rotate(${ANG}deg)`;
        line.style.top = `${top}px`;
        line.style.left = `${left}px`;
        line.style.height = `${H}px`;
        line.style.visibility = 'visible';
    };
    longClick = () => {
        this.timer = setTimeout(this.props.showImage, 500);
    };
    cancelLongClick = () => {
        clearTimeout(this.timer);
    };
    rightClick = () => {
        this.cancelLongClick();
        store.dispatch(changeFocus(this.props.value));
    };
    render() {
        const { value, focusId, viewing } = this.props;
        if (viewing) {
            return (
                <div className="lineQuestion" style={{ ...value.style, position: 'absolute' }} onClick={() => this.props.drawLine(value)}>
                    {
                        value.src ? <img src={API_URL.domain + value.src} alt="" width="100%" /> : <div dangerouslySetInnerHTML={{ __html: value.text }} />
                    }
                </div>
            );
        }
        return (
            <Rnd
                onDragStart={this.onClicked}
                onDrag={this.cancelLongClick}
                className={focusId === value.id ? 'focused' : ''}
                isDraggable
                style={value.style}
                onDoubleClick={this.changeEditable}
                initial={getPosition(value.style)}
            >
                <div
                    className="lineQuestion"
                    style={{ ...value.style, left: 'auto', top: 'auto' }}
                    onMouseOver={this.drawLine}
                    onMouseOut={this.cancelLine}
                    onMouseDown={this.longClick}
                    onContextMenu={this.rightClick}
                    onBlur={this.handleBlur}
                    onMouseUp={this.cancelLongClick}
                >
                    <span>{value.num}</span>
                    {
                        value.src ? <img src={API_URL.domain + value.src} alt="" width="100%" /> : <div contentEditable={value.contenteditable} dangerouslySetInnerHTML={{ __html: value.text }} />
                    }
                </div>
            </Rnd>
        );
    }
}

