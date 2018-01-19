/**
 * Created by sunlong on 2017/3/20.
 */
import BaseModal from './BaseModal';

export default class NoteModal extends BaseModal {
    constructor(text = '') {
        super();
        this.text = text;
        this.style = {
            position: 'absolute',
            top:'482px',
            left: '287px', 
            width: '30px', 
            height: '30px',
        };
        this.name = 'NoteModal';
    }
}
