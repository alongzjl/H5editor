import React from 'react';
import Rnd from '../../common/rnd/ReactRnd';
import store from '../../../store';
import { changeFocus, selectMultiple } from '../../../actions/h5Actions';
import './video.less';

export default class Video extends React.Component {
    onClicked = e => {
        e.stopPropagation();
        if ((navigator.platform.indexOf('Mac') === 0 && e.metaKey) || (navigator.platform.indexOf('Mac') !== 0 && e.ctrlKey)) {
            store.dispatch(selectMultiple(this.props.value.id));
            return;
        }
        store.dispatch(changeFocus(this.props.value));
    };
    disableDrag = e => {
        e.preventDefault();
    };

    render() {
        const { value, focusId, selected } = this.props;
        const srcIndex = value.code.indexOf('src=');
        const srcEnd = value.code.indexOf(' ', srcIndex);
        const src = value.code.substring(srcIndex + 5, srcEnd - 1);

        if (this.props.viewing) {
            return (
                <div className={value.className} style={value.style}>
                    <iframe width={value.style.width} height={value.style.height} src={src} allowFullScreen frameBorder={0} />
                </div>
            );
        }

        const selectedClass = selected ? 'selected' : '';
        return (
            <Rnd
                onDragStart={this.onClicked}
                className={focusId === value.id ? 'focused' : ''}
                style={value.style}
                isDraggable
            >
                <div
                    className={`${value.className} videoPlayer ${selectedClass}`}
                    onMouseDown={this.disableDrag}
                >
                    <iframe width={parseInt(value.style.width) - 2} height={value.style.height} src={src} allowFullScreen frameBorder={0} />
                </div>
            </Rnd>
        );
    }
}

