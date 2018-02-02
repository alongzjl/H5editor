/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import Action from './Action';
import Shapes from './shapes/Shapes';
import getPosition from './getPosition';

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
    render() {
        const { value } = this.props;
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
                            transform: style.transform,
                            visibility: style.visibility,
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
}

export default Shape;
