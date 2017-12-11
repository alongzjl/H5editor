import BaseModal from './BaseModal';

export default class TestModal extends BaseModal {
    constructor() {
        super();
        this.elements = [];
        this.name = 'TestModal';
        this.title = '';
        this.editable = false;
    }
}
