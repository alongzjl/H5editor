/**
 * Created by sunlong on 2017/3/25.
 */
import React from 'react';
import InputNumber from 'rc-input-number';
import Select from 'react-select';
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
            className: e.value,
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
                <h4><img src={require('./images/pulldown.png')} onClick={this.shrink} /> {t('animation') + (index + 1)}<div className="floatRight" onClick={this.deleteAnimation}><img src={require('./images/deleteAnimation.png')} width={10} height={10} /></div></h4>
                <div className="detail flex_row_between"><span className="label">方式</span>
                    <Select
                        name="form-field-name"
                        value={value.className}
                        onChange={this.onChange}
                        clearable={false}
                        searchable={false}
                        options={[
                            { value: '', label: 'Nothing' },
                            { value: 'Attention Seekers', label: 'Attention Seekers', disabled: true },
                            { value: 'animated bounce', label: 'bounce' },
                            { value: 'animated flash', label: 'flash' },
                            { value: 'animated pulse', label: 'pulse' },
                            { value: 'animated rubberBand', label: 'rubberBand' },
                            { value: 'animated shake', label: 'shake' },
                            { value: 'animated swing', label: 'swing' },
                            { value: 'animated tada', label: 'tada' },
                            { value: 'animated wobble', label: 'wobble' },
                            { value: 'animated jello', label: 'jello' },
                            { value: 'Bouncing Entrances', label: 'Bouncing Entrances', disabled: true },
                            { value: 'animated bounceIn', label: 'bounceIn' },
                            { value: 'animated bounceInDown', label: 'bounceInDown' },
                            { value: 'animated bounceInLeft', label: 'bounceInLeft' },
                            { value: 'animated bounceInRight', label: 'bounceInRight' },
                            { value: 'animated bounceInUp', label: 'bounceInUp' },
                            { value: 'Bouncing Exits', label: 'Bouncing Exits', disabled: true },
                            { value: 'animated bounceOut', label: 'bounceOut' },
                            { value: 'animated bounceOutDown', label: 'bounceOutDown' },
                            { value: 'animated bounceOutLeft', label: 'bounceOutLeft' },
                            { value: 'animated bounceOutRight', label: 'bounceOutRight' },
                            { value: 'animated bounceOutUp', label: 'bounceOutUp' },
                            { value: 'Fading Entrances', label: 'Fading Entrances', disabled: true },
                            { value: 'animated fadeIn', label: 'fadeIn' },
                            { value: 'animated fadeInDown', label: 'fadeInDown' },
                            { value: 'animated fadeInDownBig', label: 'fadeInDownBig' },
                            { value: 'animated fadeInLeft', label: 'fadeInLeft' },
                            { value: 'animated fadeInLeftBig', label: 'fadeInLeftBig' },
                            { value: 'animated fadeInRight', label: 'fadeInRight' },
                            { value: 'animated fadeInRightBig', label: 'fadeInRightBig' },
                            { value: 'animated fadeInUp', label: 'fadeInUp' },
                            { value: 'animated fadeInUpBig', label: 'fadeInUpBig' },
                            { value: 'Fading Exits', label: 'Fading Exits', disabled: true },
                            { value: 'animated fadeOut', label: 'fadeOut' },
                            { value: 'animated fadeOutDown', label: 'fadeOutDown' },
                            { value: 'animated fadeOutDownBig', label: 'fadeOutDownBig' },
                            { value: 'animated fadeOutLeft', label: 'fadeOutLeft' },
                            { value: 'animated fadeOutLeftBig', label: 'fadeOutLeftBig' },
                            { value: 'animated fadeOutRight', label: 'fadeOutRight' },
                            { value: 'animated fadeOutRightBig', label: 'fadeOutRightBig' },
                            { value: 'animated fadeOutUp', label: 'fadeOutUp' },
                            { value: 'animated fadeOutUpBig', label: 'fadeOutUpBig' },
                            { value: 'Flippers', label: 'Flippers', disabled: true },
                            { value: 'animated flip', label: 'flip' },
                            { value: 'animated flipInX', label: 'flipInX' },
                            { value: 'animated flipInY', label: 'flipInY' },
                            { value: 'animated flipOutX', label: 'flipOutX' },
                            { value: 'animated flipOutY', label: 'flipOutY' },
                            { value: 'Lightspeed', label: 'Lightspeed', disabled: true },
                            { value: 'animated lightSpeedIn', label: 'lightSpeedIn' },
                            { value: 'animated lightSpeedOut', label: 'lightSpeedOut' },
                            { value: 'Rotating Entrances', label: 'Rotating Entrances', disabled: true },
                            { value: 'animated rotateIn', label: 'rotateIn' },
                            { value: 'animated rotateInDownLeft', label: 'rotateInDownLeft' },
                            { value: 'animated rotateInDownRight', label: 'rotateInDownRight' },
                            { value: 'animated rotateInUpLeft', label: 'rotateInUpLeft' },
                            { value: 'animated rotateInUpRight', label: 'rotateInUpRight' },
                            { value: 'Rotating Exits', label: 'Rotating Exits', disabled: true },
                            { value: 'animated rotateOut', label: 'rotateOut' },
                            { value: 'animated rotateOutDownLeft', label: 'rotateOutDownLeft' },
                            { value: 'animated rotateOutDownRight', label: 'rotateOutDownRight' },
                            { value: 'animated rotateOutUpLeft', label: 'rotateOutUpLeft' },
                            { value: 'animated rotateOutUpRight', label: 'rotateOutUpRight' },
                            { value: 'Sliding Entrances', label: 'Sliding Entrances', disabled: true },
                            { value: 'animated slideInUp', label: 'slideInUp' },
                            { value: 'animated slideInDown', label: 'slideInDown' },
                            { value: 'animated slideInLeft', label: 'slideInLeft' },
                            { value: 'animated slideInRight', label: 'slideInRight' },
                            { value: 'Sliding Exits', label: 'Sliding Exits', disabled: true },
                            { value: 'animated slideOutUp', label: 'slideOutUp' },
                            { value: 'animated slideOutDown', label: 'slideOutDown' },
                            { value: 'animated slideOutLeft', label: 'slideOutLeft' },
                            { value: 'animated slideOutRight', label: 'slideOutRight' },
                            { value: 'Zoom Entrances', label: 'Zoom Entrances', disabled: true },
                            { value: 'animated zoomIn', label: 'zoomIn' },
                            { value: 'animated zoomInDown', label: 'zoomInDown' },
                            { value: 'animated zoomInLeft', label: 'zoomInLeft' },
                            { value: 'animated zoomInRight', label: 'zoomInRight' },
                            { value: 'animated zoomInUp', label: 'zoomInUp' },
                            { value: 'Zoom Exits', label: 'Zoom Exits', disabled: true },
                            { value: 'animated zoomOut', label: 'zoomOut' },
                            { value: 'animated zoomOutDown', label: 'zoomOutDown' },
                            { value: 'animated zoomOutLeft', label: 'zoomOutLeft' },
                            { value: 'animated zoomOutRight', label: 'zoomOutRight' },
                            { value: 'animated zoomOutUp', label: 'zoomOutUp' },
                            { value: 'Specials', label: 'Specials', disabled: true },
                            { value: 'animated hinge', label: 'hinge' },
                            { value: 'animated rollIn', label: 'rollIn' },
                            { value: 'animated rollOut', label: 'rollOut' },
                        ]}
                    />
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
