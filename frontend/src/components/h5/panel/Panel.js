/**
 * Created by sunlong on 2017/3/25.
 */
import React from 'react';
import Tabs from 'react-simpletabs';
import 'react-simpletabs/dist/react-simpletabs.css';
import WordPanel from './WordPanel';
import ImagePanel from './imagePanel';
import AnimationPanel from './AnimationPanel';
import PageSetPanel from './pageSetPanel';
import ShapePanel from './shapePanel';
import RecentShapePanel from './RecentShapePanel';
import ActionPanel from './ActionPanel';
import TemplatePanel from './TemplatePanel';
import TestSetPanel from './TestSetPanel';
import './panel.less';
import t from '../../i18n';

export default class Panel extends React.Component {
    state = {
        index: 1,
    };
    restoreTab = () => {
        this.setState({
            index: 1,
        });
    };
    changeTab = e => {
        this.setState({
            index: e,
        });
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.focus.id !== this.props.focus.id) {
            this.restoreTab();
        }
    }
    render() {
        const { focus, currentPage,pages } = this.props;
        const panels = [];
        switch (focus.name) { 
        case 'WordModal': {
            panels.push(<Tabs.Panel title={t('style')} key="style"><WordPanel focus={focus} page={pages} /></Tabs.Panel>);
            panels.push(<Tabs.Panel title={t('animation')} key="animation"><AnimationPanel focus={focus} /></Tabs.Panel>);
            panels.push(<Tabs.Panel title={t('action')} key="action"><ActionPanel focus={focus} page={currentPage} /></Tabs.Panel>);
            break;
        }
        case 'TestModal' : {
            panels.push(<Tabs.Panel title={t('question_select_title')} key="testSet"><TestSetPanel focus={focus} page={currentPage} /></Tabs.Panel>);
            break;
        }
        case 'FillBlanksModal' : {
            panels.push(<Tabs.Panel title={t('question_select_title')} key="testSet"><TestSetPanel focus={focus} page={currentPage} /></Tabs.Panel>);
            break;
        }
        case 'SortQuestionModal' : {
            panels.push(<Tabs.Panel title={t('question_select_title')} key="testSet"><TestSetPanel focus={focus} page={currentPage} /></Tabs.Panel>);
            break;
        }
        case 'LineQuestionModal' : {
            if (focus.src) {
                panels.push(<Tabs.Panel title={t('style')} key="style"><ImagePanel focus={focus} /></Tabs.Panel>);
            } else {
                panels.push(<Tabs.Panel title={t('style')} key="style"><WordPanel focus={focus} page={pages} /></Tabs.Panel>);
            }
            panels.push(<Tabs.Panel title={t('animation')} key="animation"><AnimationPanel focus={focus} /></Tabs.Panel>);
            panels.push(<Tabs.Panel title={t('action')} key="action"><ActionPanel focus={focus} page={currentPage} /></Tabs.Panel>);
            break;
        }
        case 'ImageModal': {
            panels.push(<Tabs.Panel title={t('style')} key="style"><ImagePanel focus={focus} /></Tabs.Panel>);
            panels.push(<Tabs.Panel title={t('animation')} key="animation"><AnimationPanel focus={focus} /></Tabs.Panel>);
            panels.push(<Tabs.Panel title={t('action')} key="action"><ActionPanel focus={focus} page={currentPage} /></Tabs.Panel>);
            break;
        }
        case 'ShapeModal': {
            if (focus.id === 0) {
                panels.push(<Tabs.Panel title={t('shape')} key="shape"><ShapePanel focus={focus} /></Tabs.Panel>);
                panels.push(<Tabs.Panel title={t('used_recently')} key="animation"><RecentShapePanel /></Tabs.Panel>);
            } else {
                panels.push(<Tabs.Panel title={t('style')} key="style"><ShapePanel focus={focus} /></Tabs.Panel>);
                panels.push(<Tabs.Panel title={t('animation')} key="animation"><AnimationPanel focus={focus} /></Tabs.Panel>);
                panels.push(<Tabs.Panel title={t('action')} key="action"><ActionPanel focus={focus} page={currentPage} /></Tabs.Panel>);
            }
            break;
        }
        case 'PageModal': {
            panels.push(<Tabs.Panel title={t('page_setting')} key="pageSet"><PageSetPanel focus={focus} /></Tabs.Panel>);
            break;
        }
        default:
            panels.push(<Tabs.Panel title={t('template_library')} key="template"><TemplatePanel isPublic token={this.props.token} /></Tabs.Panel>);
            panels.push(<Tabs.Panel title={t('template_mine')} key="myTemplate"><TemplatePanel isPublic={false} token={this.props.token} /></Tabs.Panel>);
            break;
        }
        if (panels.length === 0) {
            return null;
        }
        const testTab = focus.name == 'TestModal' || focus.name=='FillBlanksModal' || focus.name=='SortQuestionModal' || focus.name=='LineQuestionModal' ? 'testTab' : '';
        return (
            <div>
                <Tabs className={`panel ${testTab}`}  tabActive={this.state.index} onAfterChange={this.changeTab}>
                    {  
                        panels.map(panel => panel)
                    }
                </Tabs>
            </div>
        );
    }
}
