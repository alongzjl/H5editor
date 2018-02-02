/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import API_URL from '../../../common/url';
import Action from './Action';
import getPosition from './getPosition';


export default class Image extends React.Component {
    state = {
        index: 0,
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
                    <img
                        src={API_URL.upload + value.src}
                        className={animation.className}
                        style={{ ...style, boxShadow }}
                        onAnimationEnd={() => this.onAnimationEnd()}
                        onClick={() => {value.to ?this.props.lineTo(value) : null}}
                    />
                </Action>
            );
    }
}

