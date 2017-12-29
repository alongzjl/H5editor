/**
 * Created by sunlong on 16/8/3.
 */
import { hashHistory } from 'react-router';

export default class Auth {
    check() {
    	function getQueryString(name) {
	        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
	        const r = window.location.search.substr(1).match(reg);
	        if (r != null) return unescape(r[2]); return null;
	    }
    	if (!sessionStorage.getItem('access_token')&& !getQueryString('access_token')) {
            hashHistory.push('/login');
        }else if(getQueryString('access_token')){
        	sessionStorage.setItem('access_token', getQueryString('access_token'));
        }
        
        return getQueryString('material_id');  
    }
} 
