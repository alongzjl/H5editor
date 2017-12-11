import BaseModal from './BaseModal';

export default class AudioModal extends BaseModal {
    constructor(src = '') {
        super();
        this.name = 'AudioModal';
        this.src = src;
        this.style = {
            width: '258px',
            height: '66px',
            margin: '0 auto',
        };
    }
}
