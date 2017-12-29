/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import Rnd from '../../common/rnd/ReactRnd';
import store from '../../../store';
import API_URL from '../../../common/url';
import { changeFocus, selectMultiple } from '../../../actions/h5Actions';
import './audio.less';
import getPosition from './getPosition';

export default class Audio extends React.Component {
    state = {
        playing: false,
        position: 0,
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
    componentDidMount() {
        if (this.audio) {
            this.audio.addEventListener('timeupdate', () => {
                const ratio = this.audio.currentTime / this.audio.duration;
                this.setState({
                    position: ratio,
                });
            });

            this.audio.addEventListener('ended', () => {
                this.setState({
                    position: 0,
                    playing: false,
                });
            });
        }
    }
    componentWillUnMount() {
        this.audio.removeListener('timeupdate');
        this.audio.removeListener('ended');
    }
    togglePlay = () => {
        if (this.state.playing) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.setState({
            playing: !this.state.playing,
        });
    };

    render() {
        const { value, focusId, viewing, selected } = this.props;
        if (viewing) {
            return (
                <div style={value.style} className="audio-common">
                    <div className="player">
                        <div>
                            <img src={this.state.playing ? require('./images/stopvoice.png') : require('./images/play.jpg')} onClick={this.togglePlay} />
                            <div className="progress">
                                <div className="dot" style={{ marginLeft: `${this.state.position * 100}%` }}>&nbsp;</div>
                            </div>
                        </div>
                    </div>
                    <audio src={API_URL.domain + value.src} ref={com => { this.audio = com; }} />
                </div>
            );
        }

        const selectedClass = selected ? 'selected' : '';
        return (
            <Rnd
                onDragStart={this.onClicked}
                className={focusId === value.id ? 'focused' : ''}
                style={value.style}
                initial={getPosition(value)}
            >
                <img
                    onMouseDown={this.disableDrag}
                    src={require('../dialog/images/audio_dom.png')}
                    className={selectedClass}
                    style={{ width: value.style.width, height: value.style.height }}
                />
            </Rnd>
        );
    }
}

