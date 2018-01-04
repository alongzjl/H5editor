/**
 * Created by sunlong on 2017/3/20.
 */
import BaseModal from './BaseModal';

export default class PageModal extends BaseModal {
    constructor() {
        super();
        this.elements = [];
        this.name = 'PageModal';
        this.style = { width: '100%', height: '100%', position: 'relative', backgroundColor: '#fff' };
        this.title = '';
        this.editable = false;
    }
}
