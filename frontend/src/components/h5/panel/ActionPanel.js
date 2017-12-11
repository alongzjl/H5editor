/**
 * Created by sunlong on 2017/3/25.
 */
import React from 'react';
import 'rc-input-number/assets/index.css';
import 'rc-slider/assets/index.css';
import store from '../../../store';
import { changeAction, addHighlight, cancelHighlight } from '../../../actions/h5Actions';
import './actionPanel.less';
import HighlightModal from '../modal/HighlightModal';
import t from '../../i18n';

export default class AnimationPanel extends React.Component {
    getName = name => {
        switch (name) {
        case 'WordModal': return '文字';
        case 'ShapeModal': return '图形';
        case 'ImageModal': return '图片';
        case 'AudioModal': return '音频';
        case 'VideoModal': return '视频';
        case 'NoteModal': return '备注';
        default: return '';
        }
    };

    onClick = e => {
        store.dispatch(changeAction(this.props.focus.id, Object.assign({}, this.props.focus.action, { target: e.target.value })));
    };

    onChange = e => {
        store.dispatch(changeAction(this.props.focus.id, Object.assign({}, this.props.focus.action, { name: e.target.value })));
    };
    changeValue = e => {
        store.dispatch(changeAction(this.props.focus.id, Object.assign({}, this.props.focus.action, { value: e.target.value })));
    };
    highlight = element => {
        store.dispatch(addHighlight(new HighlightModal(element).plainObject()));
    };
    cancelHighlight = () => {
        store.dispatch(cancelHighlight());
    };
    render() {
        const { focus } = this.props;
        const actionName = (focus.action && focus.action.name) ? focus.action.name : '无';
        return (
            <div className="actionPanel">
                <div className="title">
                    {t('element_clicked')}
                    <select onChange={this.onChange} value={actionName}>
                        <option value="无">{t('element_clicked_none')}</option>
                        <option value="显示">{t('element_clicked_show')}</option>
                        <option value="隐藏">{t('element_clicked_hide')}</option>
                        <option value="跳转">{t('element_clicked_link')}</option>
                    </select>
                </div>
                <div className={actionName !== '无' ? 'elements' : ''}>
                    {
                        actionName !== '无' && actionName !== '跳转' && this.props.page.elements.map((element, index) => {
                            if (element.name === 'HighlightModal') {
                                return null;
                            }
                            return (
                                <div key={element.id} className="item" onMouseOver={() => this.highlight(element)} onMouseOut={this.cancelHighlight}><input type="radio" value={element.id} name="element" onClick={this.onClick} /> {this.getName(element.name)}{index}</div>
                            );
                        })
                    }
                    {
                        actionName === '跳转' && <div className="link"><input type="text" onChange={this.changeValue} placeholder={t('element_clicked_link_placeholder')} value={focus.action.value} /></div>
                    }
                </div>
            </div>
        );
    }
}
