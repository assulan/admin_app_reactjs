/**
 * Created by asus on 8/8/17.
 */
import React, {Component} from 'react'
import firebase from 'firebase'

class Question extends React.Component{
    render() {
        var question = this.props.question;
        return <div className="list-group-item">
            <div>{question.text}</div>
        </div>
    }
}

class QuestionList extends React.Component{
    // componentDidMount () {
    //     var questionRef = firebase.database().ref("questions");//.ref('Test').ref("questions");
    //     this.bindAsArray(questionRef, "questionsList");
    //     this.setState({questions: this.state.questionsList});
    // }
    //
    // constructor(props) {
    //     super(props);
    //
    //     this.state = {
    //         questions: null
    //     };
    // }
    render() {
        // const questions = this.state.questions;
        // if (this.state.questions){
        //     var commentNodes = this.state.questions.map(function (question, index) {
        //         return <Question key={index} questions={question}></Question>;
        //     });
        //
        //     return (
        //         <div>
        //             <div className='questionList'>{commentNodes}</div>
        //         </div>
        //     );
        // }
        return <div>Loading...</div>
    }
}
