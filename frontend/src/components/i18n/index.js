import texts from './lang/zh_CN';
import enTexts from './lang/en_US';

const get_language = function(){
	const locale = localStorage.getItem('locale') || 'zh_CN';
	 let text = '';
	 switch (locale) {
	    case 'zh_CN': text = texts; break;
	    case 'en_US': text = enTexts; break;
	    default: break;
    }
    if (!text) {
        console.warn(`${key}没有做国际化`);
    }
    return text;
}
export default function t(key) {
   return get_language().get(key);
    
} 
