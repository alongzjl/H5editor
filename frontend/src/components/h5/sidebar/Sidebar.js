/**
 * Created by sunlong on 2017/3/20.
 */
import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import SidebarContextMenu from './SidebarContextMenu';
import Page from '../elements/Page';
import { renamePage, changePageEditable, changeCurrentPage, sortPage } from '../../../actions/h5Actions';
import './sidebar.less';
import store from '../../../store';

function PagePreview({ page }) {
    return (
        <div className="preview">
            <Page page={{ ...page, checking: false }} viewing isTeacher />
        </div>
    );
}

function Row({ page, pageNo, currentPage }) {
    const title = page.title ? page.title : '';
    const changeTitle = e => {
        store.dispatch(renamePage(page.id, e.target.value));
    };
    const onRename = e => {
        store.dispatch(changePageEditable(page.id));
        e.preventDefault();
        e.stopPropagation();
    };
    const onChangeCurrentPage = () => {
        store.dispatch(changeCurrentPage(pageNo));
    };
    return (
        <ContextMenuTrigger id="sidebarContextMenu" collect={() => page} holdToDisplay={-1}>
            {
                page.editable
                    ? <div className={`row ${currentPage === pageNo ? 'current' : ''}`}><div className={`pageNo ${currentPage === pageNo ? 'pageNoFocus' : ''}`}>{pageNo + 1}</div><input onBlur={changeTitle} defaultValue={title} /><PagePreview page={page} /></div>
                    : <div className={`row ${currentPage === pageNo ? 'current' : ''}`} onDoubleClick={onRename} onClick={onChangeCurrentPage}><div className={`pageNo ${currentPage === pageNo ? 'pageNoFocus' : ''}`}>{pageNo + 1}</div><p className="pageTitle" title={title}>{title}</p><PagePreview page={page} /></div>
            }
        </ContextMenuTrigger>
    );
}

const SortableItem = SortableElement(({ page, pageNo, currentPage }) => <Row page={page} pageNo={pageNo} currentPage={currentPage} />);

const SortableList = SortableContainer(({ pages, currentPage }) => (
    <div className="sidebar">
        {
            pages.map((page, index) => <SortableItem index={index} key={page.id} page={page} pageNo={index} currentPage={currentPage} />)
        }
    </div>
));

class Sidebar extends React.Component {
    onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            store.dispatch(sortPage(oldIndex, newIndex));
        }
    };
    onSortMove = () => {
        if (document.selection) {
            document.selection.empty();
        } else {
            window.getSelection().removeAllRanges();
        }
    };
    render() {
        return (
            <div>
                <SortableList
                    pages={this.props.pages}
                    lockToContainerEdges
                    onSortEnd={this.onSortEnd}
                    distance={20}
                    currentPage={this.props.currentPage}
                    onSortMove={this.onSortMove}
                />
                <SidebarContextMenu pages={this.props.pages} />
            </div>
        );
    }
}

export default Sidebar;
