/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import Rnd from '../../common/rnd/ReactRnd';
import store from '../../../store';
import './word.less';
import { hideNoteModal } from '../../../actions/uiActions';
import { changeFocus } from '../../../actions/h5Actions';
import remarkImg from './images/remarked.png';

export default class Note extends React.Component {
    state = {
        hidden: true,
    };

    clicked = () => {
        store.dispatch(changeFocus(this.props.value));
    };

    doubleClicked = () => {
        store.dispatch(changeFocus(this.props.value));
        store.dispatch(hideNoteModal(false));
    };

    toggleNote = () => {
        this.setState((prev, props) => ({ hidden: !prev.hidden }));
    };

    render() {
        const { value, viewing, focusId } = this.props;

        if (viewing) {
            return (
                <div style={{ ...value.style, width: 'auto' }}>
                    <img src={remarkImg} onClick={this.toggleNote} style={{ position: 'absolute' }} />
                    {
                        !this.state.hidden && <div>{value.text}</div>
                    }
                </div>
            );
        }
        const x = value.style.left ? parseInt(value.style.left) : 0;
        const y = value.style.top ? parseInt(value.style.top) : 0;
        return (
            <Rnd
                onDragStart={this.clicked}
                className={focusId === value.id ? 'focused' : ''}
                style={value.style}
                initial={{ x, y }}
            >
                <img
                    style={{ width: value.style.width, height: value.style.height }}
                    src={remarkImg}
                    onDoubleClick={this.doubleClicked}
                    onContextMenu={this.clicked}
                />
            </Rnd>
        );
    }
}
