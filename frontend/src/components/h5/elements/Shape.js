/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import Rnd from '../../common/rnd/ReactRnd';
import store from '../../../store';
import Action from './Action';
import { changeFocus, selectMultiple } from '../../../actions/h5Actions';
import Shapes from './shapes/Shapes';

class Shape extends React.Component {
    state = {
        index: 0,
    };
    onAnimationEnd = () => {
        this.setState({
            index: this.state.index + 1,
        });
    };
    componentWillReceiveProps() { // 属性变化时，动画重新播放
        this.setState({
            index: 0,
        });
    }
    onClicked = e => {
        e.stopPropagation();
        if ((navigator.platform.indexOf('Mac') === 0 && e.metaKey) || (navigator.platform.indexOf('Mac') !== 0 && e.ctrlKey)) {
            store.dispatch(selectMultiple(this.props.value.id));
            return;
        }
        store.dispatch(changeFocus(this.props.value));
    };
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
                    <div
                        className={animation.className}
                        style={{
                            left: style.left,
                            top: style.top,
                            width: style.width,
                            height: style.height,
                            position: 'absolute',
                            animationDelay: animation.animationDelay,
                            animationDuration: animation.animationDuration,
                            animationIterationCount: animation.animationIterationCount,
                            boxShadow,
                        }}
                        onAnimationEnd={this.onAnimationEnd}
                    >
                        <Shapes
                            name={value.shapeName}
                            style={style}
                        />
                    </div>
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
                <div
                    className={focusId === value.id ? `${animation.className} ${selectedClass}` : selectedClass}
                    style={{
                        animationDelay: animation.animationDelay,
                        animationDuration: animation.animationDuration,
                        animationIterationCount: animation.animationIterationCount,
                        boxShadow,
                    }}
                    onAnimationEnd={this.onAnimationEnd}
                >
                    <Shapes
                        name={value.shapeName}
                        style={style}
                    />
                </div>
            </Rnd>
        );
    }
}

export default Shape;
