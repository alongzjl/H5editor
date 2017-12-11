/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import TemplateList from './templateList';
import './templatePanel.less';
import t from '../../i18n';

export default class TemplatePanel extends React.Component {
    render() {
        return (
            <div className="template">
                <ul className="filterTemplate">
                    <li>{t('template_category')}</li>
                    <li>{t('template_style')}</li>
                </ul>
                <TemplateList isPublic={this.props.isPublic} token={this.props.token} />
            </div>
        );
    }
}
