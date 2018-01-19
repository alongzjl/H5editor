import React from 'react';
import Rnd from '../../../common/rnd/ReactRnd';
import store from '../../../../store';
import { changeFocus } from '../../../../actions/h5Actions';
import './fillBlanks.less';

export default class Sort extends React.Component {
    state = {
        index: 0,
    };
    onClicked = e => {
        e.stopPropagation();
        store.dispatch(changeFocus(this.props.value));
    };
    componentWillReceiveProps() {
        this.setState({
            index: 0,
        });
    }

    render() {
        const { value, focusId, viewing } = this.props;
        if (viewing) {
            return (
                <div className="sortitem flex_row_start flex_vertical_middle" style={value.style}>
                    <div className="inputClass">{value.answerShow}</div>
                </div>
            );
        }
        return (
            <Rnd
                onDragStart={this.onClicked}
                className={focusId === value.id ? 'focused' : ''}
                isDraggable
                style={value.style}
            >
                <div className="sortitem flex_row_start flex_vertical_middle">
                    <span className="index">{value.num}</span>
                    <div className="inputClass" />
                </div>
            </Rnd>
        );
    }
}
