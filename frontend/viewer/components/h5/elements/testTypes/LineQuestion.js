/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import getPosition from '../getPosition';
import API_URL from '../../../../common/url';
import './lineQuestion.less';

export default class LineQuestion extends React.Component {
    state = {
        index: 0,
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
        const { value, isTeacher } = this.props;
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
                <div
                    className={`lineQuestion ${animation.className}`}
                    style={{ ...style, position: 'absolute' }}
                    onClick={() => this.props.drawLine(value)}
                    onAnimationEnd={this.onAnimationEnd}
                >
                {
                	isTeacher ? <span>{value.num}</span> : null
                }
                {
                    value.src ? <img src={API_URL.upload + value.src} alt="" width="100%" /> : <div dangerouslySetInnerHTML={{ __html: value.text }} />
                }
                </div>
            );
    }
}

