/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import { ActionCreators } from 'redux-undo';
import store from '../../../store';
import './pageContainer.less';
import t from '../../i18n';

class Sidebar extends React.Component {
    undo = () => {
        store.dispatch(ActionCreators.undo());
    };

    redo = () => {
        store.dispatch(ActionCreators.redo());
    };

    render() {
        return (
            <ul className="action">
                <li title={t('revoke')} onClick={this.undo} />
                <li title={t('restore')} onClick={this.redo} />
            </ul>
        );
    }
}

export default Sidebar;
