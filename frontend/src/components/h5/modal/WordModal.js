/**
 * Created by sunlong on 2017/3/20.
 */
import BaseModal from './BaseModal';

export default class WordModal extends BaseModal {
    constructor(text = '双击编辑文字', style = {}, answer = -1,num=0) {
        super();
        this.text = text;
        this.style = Object.assign({}, {
            position: 'absolute',
            height: '26px',
            lineHeight:'26px',
            fontSize: '20px',
            width: '120px',
            textAlign: 'left',
            top: 0,
            left: 0,
            transform: 'rotate(0deg)',
        }, style);
        this.name = 'WordModal';
        this.pinyins = [];
        this.symbol = [];
        this.animations = [];
        this.contenteditable = false;
        this.action = {};
        this.answer = answer;
        this.chooseAnswer = false;
        this.fontFace = ''; 
        this.accessKey = 'acc87a2f8c8042b798071f8b61de1450'; 
        this.num = num
    }
}
