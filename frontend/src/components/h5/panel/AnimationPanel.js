/**
 * Created by sunlong on 2017/3/25.
 */
import React from 'react';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import 'rc-slider/assets/index.css';
import store from '../../../store';
import AnimationModal from '../modal/AnimationModal';
import { changeAnimation, addAnimation, delAnimation } from '../../../actions/h5Actions';
import './animationPanel.less';
import t from '../../i18n';

export default class AnimationPanel extends React.Component {
    addAnimation = () => {
        store.dispatch(addAnimation(new AnimationModal().plainObject()));
    };
    render() {
        return (
            <div className="animationPanel">
                <div className="animationTitle" onClick={this.addAnimation}>{t('animation_add')}</div>
                {
                    this.props.focus.animations.map((value, index) => <AnimationSetting key={value.id} index={index} value={value} />)
                }
            </div>
        );
    }
}

class AnimationSetting extends React.Component {
    state = {
        shrinked: false,
    };
    changeDelay = delay => {
        store.dispatch(changeAnimation(this.props.index, Object.assign({}, this.props.value, {
            animationDelay: `${delay}s`,
        })));
    };

    changeDuration = duration => {
        store.dispatch(changeAnimation(this.props.index, Object.assign({}, this.props.value, {
            animationDuration: `${duration}s`,
        })));
    };

    changeIteration = iteration => {
        store.dispatch(changeAnimation(this.props.index, Object.assign({}, this.props.value, {
            animationIterationCount: iteration,
        })));
    };

    onChecked = e => {
        if (e.target.checked) {
            this.changeIteration('infinite');
        } else {
            this.changeIteration(1);
        }
    };

    onChange = e => {
        store.dispatch(changeAnimation(this.props.index, Object.assign({}, this.props.value, {
            className: e.target.value,
        })));
    };

    deleteAnimation = () => {
        store.dispatch(delAnimation(this.props.index));
    };

    shrink = () => {
        this.setState({
            shrinked: !this.state.shrinked,
        });
    };

    render() {
        const { value, index } = this.props;
        if (this.state.shrinked) {
            return (
                <div className="model_animation">
                    <h4><img src={require('./images/pulldown.png')} onClick={this.shrink} className="rotate90" /> {t('animation') + (index + 1)} ({value.className ? value.className.split(' ')[1] : '无'}) <div className="floatRight" onClick={this.deleteAnimation}>X</div></h4>
                </div>
            );
        }

        return (
            <div className="model_animation">
                <h4><img src={require('./images/pulldown.png')} onClick={this.shrink} /> {t('animation') + (index + 1)}<div className="floatRight" onClick={this.deleteAnimation}>X</div></h4>
                <div className="detail"><span className="label">方式</span>
                    <select onChange={this.onChange} defaultValue={value.className}>
                        <option value="">Nothing</option>
                        <optgroup label="Attention Seekers">
                            <option value="animated bounce">bounce</option>
                            <option value="animated flash">flash</option>
                            <option value="animated pulse">pulse</option>
                            <option value="animated rubberBand">rubberBand</option>
                            <option value="animated shake">shake</option>
                            <option value="animated swing">swing</option>
                            <option value="animated tada">tada</option>
                            <option value="animated wobble">wobble</option>
                            <option value="animated jello">jello</option>
                        </optgroup>

                        <optgroup label="Bouncing Entrances">
                            <option value="animated bounceIn">bounceIn</option>
                            <option value="animated bounceInDown">bounceInDown</option>
                            <option value="animated bounceInLeft">bounceInLeft</option>
                            <option value="animated bounceInRight">bounceInRight</option>
                            <option value="animated bounceInUp">bounceInUp</option>
                        </optgroup>

                        <optgroup label="Bouncing Exits">
                            <option value="animated bounceOut">bounceOut</option>
                            <option value="animated bounceOutDown">bounceOutDown</option>
                            <option value="animated bounceOutLeft">bounceOutLeft</option>
                            <option value="animated bounceOutRight">bounceOutRight</option>
                            <option value="animated bounceOutUp">bounceOutUp</option>
                        </optgroup>

                        <optgroup label="Fading Entrances">
                            <option value="animated fadeIn">fadeIn</option>
                            <option value="animated fadeInDown">fadeInDown</option>
                            <option value="animated fadeInDownBig">fadeInDownBig</option>
                            <option value="animated fadeInLeft">fadeInLeft</option>
                            <option value="animated fadeInLeftBig">fadeInLeftBig</option>
                            <option value="animated fadeInRight">fadeInRight</option>
                            <option value="animated fadeInRightBig">fadeInRightBig</option>
                            <option value="animated fadeInUp">fadeInUp</option>
                            <option value="animated fadeInUpBig">fadeInUpBig</option>
                        </optgroup>

                        <optgroup label="Fading Exits">
                            <option value="animated fadeOut">fadeOut</option>
                            <option value="animated fadeOutDown">fadeOutDown</option>
                            <option value="animated fadeOutDownBig">fadeOutDownBig</option>
                            <option value="animated fadeOutLeft">fadeOutLeft</option>
                            <option value="animated fadeOutLeftBig">fadeOutLeftBig</option>
                            <option value="animated fadeOutRight">fadeOutRight</option>
                            <option value="animated fadeOutRightBig">fadeOutRightBig</option>
                            <option value="animated fadeOutUp">fadeOutUp</option>
                            <option value="animated fadeOutUpBig">fadeOutUpBig</option>
                        </optgroup>

                        <optgroup label="Flippers">
                            <option value="animated flip">flip</option>
                            <option value="animated flipInX">flipInX</option>
                            <option value="animated flipInY">flipInY</option>
                            <option value="animated flipOutX">flipOutX</option>
                            <option value="animated flipOutY">flipOutY</option>
                        </optgroup>

                        <optgroup label="Lightspeed">
                            <option value="animated lightSpeedIn">lightSpeedIn</option>
                            <option value="animated lightSpeedOut">lightSpeedOut</option>
                        </optgroup>

                        <optgroup label="Rotating Entrances">
                            <option value="animated rotateIn">rotateIn</option>
                            <option value="animated rotateInDownLeft">rotateInDownLeft</option>
                            <option value="animated rotateInDownRight">rotateInDownRight</option>
                            <option value="animated rotateInUpLeft">rotateInUpLeft</option>
                            <option value="animated rotateInUpRight">rotateInUpRight</option>
                        </optgroup>

                        <optgroup label="Rotating Exits">
                            <option value="animated rotateOut">rotateOut</option>
                            <option value="animated rotateOutDownLeft">rotateOutDownLeft</option>
                            <option value="animated rotateOutDownRight">rotateOutDownRight</option>
                            <option value="animated rotateOutUpLeft">rotateOutUpLeft</option>
                            <option value="animated rotateOutUpRight">rotateOutUpRight</option>
                        </optgroup>

                        <optgroup label="Sliding Entrances">
                            <option value="animated slideInUp">slideInUp</option>
                            <option value="animated slideInDown">slideInDown</option>
                            <option value="animated slideInLeft">slideInLeft</option>
                            <option value="animated slideInRight">slideInRight</option>
                        </optgroup>

                        <optgroup label="Sliding Exits">
                            <option value="animated slideOutUp">slideOutUp</option>
                            <option value="animated slideOutDown">slideOutDown</option>
                            <option value="animated slideOutLeft">slideOutLeft</option>
                            <option value="animated slideOutRight">slideOutRight</option>
                        </optgroup>

                        <optgroup label="Zoom Entrances">
                            <option value="animated zoomIn">zoomIn</option>
                            <option value="animated zoomInDown">zoomInDown</option>
                            <option value="animated zoomInLeft">zoomInLeft</option>
                            <option value="animated zoomInRight">zoomInRight</option>
                            <option value="animated zoomInUp">zoomInUp</option>
                        </optgroup>

                        <optgroup label="Zoom Exits">
                            <option value="animated zoomOut">zoomOut</option>
                            <option value="animated zoomOutDown">zoomOutDown</option>
                            <option value="animated zoomOutLeft">zoomOutLeft</option>
                            <option value="animated zoomOutRight">zoomOutRight</option>
                            <option value="animated zoomOutUp">zoomOutUp</option>
                        </optgroup>

                        <optgroup label="Specials">
                            <option value="animated hinge">hinge</option>
                            <option value="animated jackInTheBox">jackInTheBox</option>
                            <option value="animated rollIn">rollIn</option>
                            <option value="animated rollOut">rollOut</option>
                        </optgroup>
                    </select>
                </div>
                <div><span className="label">{t('animation_delay')}</span><InputNumber value={parseFloat(value.animationDelay).toFixed(1)} min={0} step={0.1} onChange={this.changeDelay} /></div>
                <div><span className="label">{t('animation_time')}</span><InputNumber value={parseFloat(value.animationDuration).toFixed(1)} min={0} step={0.1} onChange={this.changeDuration} /></div>
                <div>
                    <span className="label">{t('animation_iteration')}</span>
                    <InputNumber defaultValue={value.animationIterationCount === 'infinite' ? 1 : value.animationIterationCount} min={1} onChange={this.changeIteration} />
                    <div className="floatRight"><input type="checkbox" onChange={this.onChecked} defaultValue={value.animationIterationCount === 'infinite'} />{t('animation_infinite')}</div>
                </div>
            </div>
        );
    }
}
