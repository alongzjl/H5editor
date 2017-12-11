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
            top: '610px',
            left: '327px',
            width: '30px',
            height: '30px',
        };
        this.name = 'NoteModal';
    }
}
