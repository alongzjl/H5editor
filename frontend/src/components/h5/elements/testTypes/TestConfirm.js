import React from 'react';
import store from '../../../../store';
import { changeSortAnswerStyle} from '../../../../actions/testActions';
import './fillBlanks.less';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import API_URL from '../../../../common/url';
 
export default class TestConfirm extends React.Component {
	 
	 componentDidMount () {
	 	 this.connect();
	 };
	connect = () => {
		 const rightOrColor = this.props.rightOrColor;
        this.props.isTeacher&&this.props.stompClient && this.props.stompClient.connect({}, frame => {
        	this.props.stompClient.subscribe('/topic/flip', data => {
                 const message = JSON.parse(data.body);
                 switch (message.data.name) {
                   		case 'sort' : this.correctSort(rightOrColor,message.data.list);
                   		break;
                   		case 'blank' : this.correctFillBlank(rightOrColor,message.data.list);
                   		break;
                   		case 'choose' : this.correctChooseItem(rightOrColor,message.data.list);
                   		break;
                   		default:;
                   		break;
                   }
             });
        })
   }; 
	
    correctSort = (rightOrColor,sortQuestions) => {
       sortQuestions.forEach(item =>{
        	const color = item.answer !== '' && item.answer === item.answerShow ? rightOrColor.right : rightOrColor.error;
        	 store.dispatch(changeSortAnswerStyle(item.id,{ color:color }));
        });
     };
    correctFillBlank = (rightOrColor,sortQuestions) => {
    	sortQuestions.forEach(item =>{
        	const color = item.answerIndex === item.chooseIndex ? rightOrColor.right : rightOrColor.error;
        	 store.dispatch(changeSortAnswerStyle(item.id,{ color:color }));
       }); 
      }; 
    correctChooseItem = (rightOrColor,sortQuestions) => {
    	 sortQuestions.forEach(item =>{
        	const color = item.answer ===1 ? rightOrColor.right : (item.answer ===0 && item.chooseAnswer ? rightOrColor.error : rightOrColor.common);
        	 store.dispatch(changeSortAnswerStyle(item.id,{ color:color })); 
       }); 
     };
    correctLine = () => {
    	this.props.correct();
    };
    
    chooseRight = e => {
    	 const title = this.props.value.title;
    	 const rightOrColor = this.props.rightOrColor;
    	 const sortList = this.props.sort;
    	 let allRight = [];
    	 let sortQuestions = [];
    	 switch (title) {
    	 	case 'sort' : 
    	 		sortQuestions = sortList.filter(item => item.name === 'SortQuestionModal');
    	 		this.correctSort(rightOrColor,sortQuestions);
    	 		allRight = sortQuestions.filter(item => item.answer == '' ||  item.answer != item.answerShow );
    	 		 this.props.stompClient&&this.props.stompClient.send('/message/page/flip', {}, JSON.stringify({ name: 'sort test', data: { name:'sort', list: sortQuestions } }));
    	 	break;
    	 	case 'blank':
	    	 	sortQuestions = sortList.filter(item => item.name === "FillBlanksModal");
	    	 	this.correctFillBlank(rightOrColor,sortQuestions);
	    	 	allRight = sortQuestions.filter(item => item.answerIndex != item.chooseIndex); 
	    	 	 this.props.stompClient&&this.props.stompClient.send('/message/page/flip', {}, JSON.stringify({ name: 'blank test', data: { name:'blank', list: sortQuestions } }));
    	 	break;
    	 	case 'choose' :
	    	 	sortQuestions = sortList.filter(item => item.name === "WordModal");
	    	 	this.correctChooseItem(rightOrColor,sortQuestions) ;
	    	 	allRight = sortQuestions.filter(item => (item.answer ===1 && !item.chooseAnswer) || (item.answer !=1 && item.chooseAnswer)); 
	    	 	 this.props.stompClient&&this.props.stompClient.send('/message/page/flip', {}, JSON.stringify({ name: 'choose test', data: { name:'choose', list: sortQuestions } }));
    	 	break;
    	 	case 'line' : this.correctLine();
    	 	break;
    	 	default : ;
    	 	break;
    	 };
    	 const allBackground = allRight.length === 0 ? rightOrColor.right : rightOrColor.error;
         allRight ? store.dispatch(changeSortAnswerStyle(this.props.value.id,{ background:allBackground})) : null;
      }; 
    render() {
        const { viewing,isTeacher,value } = this.props;
        if (viewing && isTeacher) {
        	if(value.title === 'choose'){
        		const sortList = this.props.sort.filter(item => item.name === "WordModal");
        		let chooseAnswers = '';
	        	sortList.forEach((item,index) =>{
		        		item.answer ===1 ? chooseAnswers += item.text + '  ' : null;
		       }); 
		       const no_answer = sortList.filter(item=>item.answer ===1);
		       return <div className="TestConfirm" style={{...this.props.value.style}} >{no_answer.length == 0 ? '未设置答案' : chooseAnswers}</div>;
        	}else if(value.title === 'sort'){
        		const sortList = this.props.sort.filter(item => item.name === "SortQuestionModal");
        		let sortAnswers = '';
	        	sortList.forEach((item,index) =>{
	        		sortAnswers += item.answer + '  ';
		        }); 
		        const no_answer = sortList.filter(item=>item.answer !=='');
		       return <div className="TestConfirm" style={{...this.props.value.style}} >{no_answer.length == 0 ? '未设置答案' : sortAnswers}</div>;
        	}
        	 return <div className="TestConfirm" style={{...this.props.value.style}} >确定</div>;
        }else if(viewing && !isTeacher){
        	 return <div className="TestConfirm" style={{...this.props.value.style}} onClick={this.chooseRight}>确定</div>;
        }
        return (
            <div className="TestConfirm">确定</div>
        );
    }
}
