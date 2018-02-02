/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import API_URL from '../../../common/url';
import './audio.less';
import getPosition from './getPosition';

export default class Audio extends React.Component {
    state = {
        playing: false,
        position: 0,
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
        const { value} = this.props;
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
                    <audio src={API_URL.upload + value.src} ref={com => { this.audio = com; }} />
                </div>
            );
   }
}

