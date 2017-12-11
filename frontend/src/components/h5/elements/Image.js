/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import Rnd from '../../common/rnd/ReactRnd';
import store from '../../../store';
import API_URL from '../../../common/url';
import Action from './Action';
import { changeFocus, selectMultiple } from '../../../actions/h5Actions';

export default class Image extends React.Component {
    state = {
        index: 0,
    };
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
    onAnimationEnd = () => {
        this.setState({
            index: this.state.index + 1,
        });
    };
    componentWillReceiveProps() {
        this.setState({
            index: 0,
        });
    }
    render() {
        const { value, focusId, viewing, selected } = this.props;
        let animation = {};
        if (value.animations.length > this.state.index) {
            animation = value.animations[this.state.index];
        }
        const style = Object.assign({}, value.style, {
            animationDelay: animation.animationDelay,
            animationDuration: animation.animationDuration,
            animationIterationCount: animation.animationIterationCount,
        });
        const boxShadow = style.shadow ? `rgba(${style.shadow.r}, ${style.shadow.g}, ${style.shadow.b}, ${style.shadow.a}) 0px 8px 10px` : {};
        if (viewing) {
            return (
                <Action action={value.action}>
                    <img
                        src={API_URL.upload + value.src}
                        className={animation.className}
                        style={{ ...style, boxShadow }}
                        onAnimationEnd={() => this.onAnimationEnd()}
                    />
                </Action>
            );
        }
        const selectedClass = selected ? 'selected' : '';
        return (
            <Rnd
                onDragStart={this.onClicked}
                className={focusId === value.id ? 'focused' : ''}
                isDraggable
                style={style}
            >
                <img
                    src={API_URL.upload + value.src}
                    className={focusId === value.id ? `${animation.className} ${selectedClass}` : selectedClass}
                    style={{
                        width: value.style.width,
                        height: value.style.height,
                        opacity: value.style.opacity,
                        border: value.style.border,
                        borderWidth: value.style.borderWidth,
                        borderColor: value.style.borderColor,
                        animationDelay: animation.animationDelay,
                        animationDuration: animation.animationDuration,
                        animationIterationCount: animation.animationIterationCount,
                        boxShadow: `rgba(${style.shadow.r}, ${style.shadow.g}, ${style.shadow.b}, ${style.shadow.a}) 0px 8px 10px`,
                    }}
                    onMouseDown={this.disableDrag}
                    onAnimationEnd={() => this.onAnimationEnd()}
                />
            </Rnd>
        );
    }
}
