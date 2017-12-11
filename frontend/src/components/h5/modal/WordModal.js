/**
 * Created by sunlong on 2017/3/20.
 */
import BaseModal from './BaseModal';

export default class WordModal extends BaseModal {
    constructor(text = '双击编辑文字', style = {}, answer = -1) {
        super();
        this.text = text;
        this.style = Object.assign({}, {
            height: '26px',
            fontSize: '14px',
            width: '92px',
            textAlign: 'center',
        }, style);
        this.name = 'WordModal';
        this.pinyin = false;
        this.symbol = [];
        this.animations = [];
        this.contenteditable = false;
        this.action = {};
        this.answer = answer;
    }
}
