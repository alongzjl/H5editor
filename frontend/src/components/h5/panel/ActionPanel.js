/**
 * Created by sunlong on 2017/3/25.
 */
import React from 'react';
import 'rc-input-number/assets/index.css';
import 'rc-slider/assets/index.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import store from '../../../store';
import { changeAction, addHighlight, cancelHighlight, changeElementVisibility } from '../../../actions/h5Actions';
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
        if (this.props.focus.action.name === '显示') {
            store.dispatch(changeElementVisibility(e.target.value, { visibility: 'hidden' }));
        }
        store.dispatch(changeAction(this.props.focus.id, Object.assign({}, this.props.focus.action, { target: e.target.value })));
    };

    onChange = e => {
        store.dispatch(changeAction(this.props.focus.id, Object.assign({}, this.props.focus.action, { name: e.value })));
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
                <div className="title flex_row_between flex_vertical_middle">
                    {t('element_clicked')}
                    <Select
                        name="form-field-name"
                        value={actionName}
                        onChange={this.onChange}
                        clearable={false}
                        searchable={false}
                        options={[
                            { value: '无', label: t('element_clicked_none') },
                            { value: '显示', label: t('element_clicked_show') },
                            { value: '隐藏', label: t('element_clicked_hide') },
                            { value: '跳转', label: t('element_clicked_link') },
                        ]}
                    />
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
