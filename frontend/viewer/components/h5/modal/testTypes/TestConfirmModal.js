import BaseModal from '../BaseModal';

export default class TestConfirmModal extends BaseModal {
    constructor(title,style) {
        super();
        this.name = 'TestConfirmModal';
        this.style={
        	...style
        }
        this.title = title;
        this.editable = false; 
        this.lineList = undefined;
    }
}
