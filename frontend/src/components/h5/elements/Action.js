/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import store from '../../../store';
import { changeElementVisibility } from '../../../actions/h5Actions';

export default class Action extends React.Component {
    state = {
        link: '',
    };
    onClick = e => {
        e.preventDefault();
        const action = this.props.action;
        if (action && action.target) {
            if (action.name === '显示') {
                store.dispatch(changeElementVisibility(action.target, { visibility: 'visible' }));
            } else if (action.name === '隐藏') {
                store.dispatch(changeElementVisibility(action.target, { visibility: 'hidden' }));
            }
        } else if (action && action.name === '跳转') {
            this.setState({
                link: action.value,
            });
        }
    };
    render() {
        return this.state.link ? <iframe src={this.state.link} frameBorder={0} width="100%" height="100%" /> : <div onClick={this.onClick}>{this.props.children}</div>;
    }
}
