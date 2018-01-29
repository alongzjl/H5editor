import React from 'react';
import store from '../../../../store';
import { changeSortAnswerStyle,changeSortAnswerShow,changeFillChooseIndex, changeLineShow} from '../../../../actions/testActions';
import { changeWordAnswerChoose } from '../../../../actions/h5Actions';
import './fillBlanks.less';
import API_URL from '../../../../common/url';
 
export default class TestConfirm extends React.Component {
	 
	 componentDidMount () {
	 	 this.connect() ;
	 };
	connect = () => {
		 const rightOrColor = this.props.rightOrColor;
		 const stompClient = this.props.stompClient;
		 const mKey = this.props.mKey;
        this.props.isTeacher && stompClient && stompClient.connect({}, frame => {
        		stompClient.subscribe('/topic/choice_flip', data => {
                 const message = JSON.parse(data.body);
                 message.data.id ==mKey ?  this.choose_answer_show(rightOrColor,message.data.list) : null;
              });
              stompClient.subscribe('/topic/blank_flip', data => {
                 const message = JSON.parse(data.body);
                    message.data.id ==mKey ?  this.blank_answer_show(rightOrColor,message.data.list) : null;
              });
              stompClient.subscribe('/topic/sort_flip', data => {
                 const message = JSON.parse(data.body);
                    message.data.id ==mKey ?  this.sort_answer_show(rightOrColor,message.data.list) : null;
              });
              stompClient.subscribe('/topic/matching_flip', data => {
              		const message = JSON.parse(data.body);
              	     message.data.mKey ==mKey ?  store.dispatch(changeLineShow(message.data.id,JSON.stringify(message.data.list))) : null;
              }); 
        })  
   }; 
   //教师端显示学生做的答案
	sort_answer_show = (rightOrColor,sortQuestions) => {
		 sortQuestions.forEach(item =>{
        	 store.dispatch(changeSortAnswerShow(item.id, item.answerShow));
        });
        this.correctSort(rightOrColor,sortQuestions)
	};
	blank_answer_show = (rightOrColor,sortQuestions) => {
		 sortQuestions.forEach(item =>{
        	 store.dispatch(changeFillChooseIndex(item.id, item.chooseIndex));
        });
        this.correctFillBlank(rightOrColor,sortQuestions)
	};
	choose_answer_show = (rightOrColor,sortQuestions) => {
		 sortQuestions.forEach(item =>{
        	store.dispatch(changeWordAnswerChoose(item.id,item.chooseAnswer));
        });
        this.correctChooseItem(rightOrColor,sortQuestions)
	};
	//学生端和教师端公用的做题的答案的样式展示
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
    	 const mKey = this.props.mKey;
    	 let sortQuestions = [];
    	 switch (title) {
    	 	case 'sort' : 
    	 		sortQuestions = sortList.filter(item => item.name === 'SortQuestionModal');
    	 		const post_data_sort = sortQuestions.map(item => {return {id:item.id,answerShow:item.answerShow,answer:item.answer}});
    	 		this.correctSort(rightOrColor,sortQuestions);
    	 		 this.props.stompClient&&this.props.stompClient.send('/message/sort/flip', {}, JSON.stringify({ data: {id:mKey,  list: post_data_sort } }));
    	 	break;
    	 	case 'blank':
	    	 	sortQuestions = sortList.filter(item => item.name === "FillBlanksModal");
	    	 	const post_data_blank = sortQuestions.map(item => {return {id:item.id, chooseIndex:item.chooseIndex, answerIndex:item.answerIndex }});
	    	 	this.correctFillBlank(rightOrColor,sortQuestions);
	    	 	 this.props.stompClient&&this.props.stompClient.send('/message/blank/flip', {}, JSON.stringify({ data: { id:mKey,list: post_data_blank } }));
    	 	break;
    	 	case 'choose' :
	    	 	sortQuestions = sortList.filter(item => item.name === "WordModal");
	    	 	const post_data_choose = sortQuestions.map(item => {return {id:item.id,answer:item.answer,chooseAnswer:item.chooseAnswer}});
	    	 	this.correctChooseItem(rightOrColor,sortQuestions) ;
	    	 	 this.props.stompClient&&this.props.stompClient.send('/message/choice/flip', {}, JSON.stringify({ data: { id:mKey,list: post_data_choose } }));
    	 	break;
    	 	case 'line' : this.correctLine();
    	 	break;
    	 	default : ;
    	 	break;
    	 };
    	 store.dispatch(changeSortAnswerStyle(this.props.value.id,{ background:'#7b818f'}));
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
        	}else {
        		 return <div style={{display:'none'}}></div>;
        	}
         }else if(viewing && !isTeacher){
        	 return <div className="TestConfirm" style={{...this.props.value.style}} onClick={this.chooseRight}>确定</div>;
        }
        return (
            <div className="TestConfirm">确定</div>
        );
    }
}
