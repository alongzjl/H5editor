import React from 'react';

import ChooseItem from './testTypes/ChooseItemPanel';
import FillBlanks from './testTypes/FillBlanksPanel';
import OnLine from './testTypes/LinePanel';
import Sort from './testTypes/SortPanel';
import './TestSetPanel.less';
import t from '../../i18n';

export default class TestSetPanel extends React.Component {
    state = {
        type: 0,
    };
    chooseType = type => {
        this.setState({
            type,
        });
    };
    componentWillReceiveProps(nextProps) {
    	this.setType(nextProps.page.elements);
    }
    componentWillMount() {
    	 this.setType(this.props.page.elements);
    }
    setType = elements => {
        for (const element of elements) {
            if (element.name === 'FillBlanksModal') {
                this.chooseType(2);
                return
            } else if (element.name === 'SortQuestionModal') {
            	this.chooseType(4);
            	return
            } else if (element.name === 'WordModal' && element.answer !== undefined && element.answer !== -1 && element.answer !== 'sort') {
                this.chooseType(1);
                return
            } else if (element.name === 'LineQuestionModal') {
                this.chooseType(3);
                return
            }
        }
    };
    render() {
        const types = [
            { type: 1, display: t('question_select'), content: <ChooseItem focus={this.props.focus} page={this.props.page} /> },
            { type: 2, display: t('question_blank'), content: <FillBlanks focus={this.props.focus} page={this.props.page} /> },
            { type: 3, display: t('question_line'), content: <OnLine page={this.props.page} /> },
            { type: 4, display: t('question_sort'), content: <Sort focus={this.props.focus} page={this.props.page} /> },
        ];
         return (
            <div>
                <div className="testSetPanelHead"> {t('question_select_title')}</div>
                <ul className="testLists">
                    {
                        types.map(item => (
                            <li type={item.type} key={item.type}>
                                <p onClick={() => { this.chooseType(item.type); }}>{item.display}</p>
                                {
                                    this.state.type === item.type ? <div className="testDetails">{item.content}</div> : null
                                }
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}
