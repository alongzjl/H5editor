import BaseModal from '../BaseModal';

export default class TestConfirmModal extends BaseModal {
    constructor(title) {
        super();
        this.name = 'TestConfirmModal';
        this.title = title;
        this.editable = false;
    }
}
