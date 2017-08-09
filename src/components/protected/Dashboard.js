import React, {Component} from 'react'
import ReactFireMixin from 'reactfire'
import {ref} from '../../config/constants'
import firebase from 'firebase'
import Modal from 'react-modal';
// import BootstrapModal from 'react-bootstrap'
// import Latex from 'react-latex'
// import Highlight from 'react-highlighter'
// import QuestionList from './Question'
// import Modal from 'react-bootstrap'
import {Button, Popover, Tooltip, OverlayTrigger, Nav, NavItem, ButtonToolbar, FieldGroup, Radio, FormGroup, ControlLabel, FormControl, HelpBlock, Form} from 'react-bootstrap'


var selectedCategory = '';

var Category = React.createClass({


    showQuestions: function (e) {
        e.preventDefault();
        const input = this.refs.categoryName;
        var category = input.value;
        document.getElementById('questions').style.visibility = 'visible';
        // this.refs.categoryNameDisplayed.style.background="red"
        this.props.loadQuestionsFromCategory(category);
    },

    remove: function () {
        var categoryName = this.props.name['.key'];
        ref.child('Categories').child(categoryName).remove();
        ref.child('questions').child(categoryName).remove();
    },

    render: function () {
        var category = this.props.name['.key'];
        return <div className="list-group-item" key={category}>
            <div className="pull-right">
                <button className="btn btn-xs btn-danger" onClick={this.remove}>
                    Delete
                </button>
            </div>

            <div className="pull-right" style={{marginRight: "5px"}}>
                <button ref="categoryName" value={category} className="btn btn-xs btn-success"
                        onClick={this.showQuestions}>Questions
                </button>
            </div>
            <span ref="categoryNameDisplayed">{category}</span>
        </div>
    }
});

var CategoryList = React.createClass({
    render: function () {
        var dummy = this.props.loadQuestionsFromCategory;
        var commentNodes = this.props.data.map(function (category, index) {
            return <Category key={index} name={category} loadQuestionsFromCategory={dummy}></Category>;
        });
        return <div className='categoryList'>{commentNodes}</div>;
    }
});

// var Question = React.createClass({
//     render: function () {
//         var questions = this.props.questions;
//         var empty = questions == 'Empty';
//         if (!empty) {
//             return <div>
//                 <div>{questions}</div>
//             </div>
//         }
//
//
//         // return <div className="list-group-item" key={questions}>
//         //     <div className="pull-right">
//         //         <button className="btn btn-xs btn-danger" onClick={this.remove}>
//         //             Delete
//         //         </button>
//         //     </div>
//         //
//         //     {questions}
//         // </div>
//     }
// });

class Question extends React.Component{
    render() {
        var question = this.props.question;
        return <div className="list-group-item">
            <div>{question.text}</div>
        </div>
    }
}

class QuestionList extends React.Component{
    render() {
        var commentNodes = this.props.data.map(function (question, index) {
            return <Question key={index} questions={question}></Question>;
        });

        return (
            <div>
                <div className='questionList'>{commentNodes}</div>
            </div>
        );

    }
}

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};


var App = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState() {
        return { showModal: false, category: null };
    },

    close() {
        this.setState({ showModal: false });
    },

    open() {
        this.setState({ showModal: true });
    },

    showForm(e){
        this.open();
    },
    componentWillUpdate: function (nextProps) {
        console.log(nextProps)
    },
    componentWillMount: function () {
        var categoryRef = firebase.database().ref("Categories");
        this.bindAsArray(categoryRef, "categories");

        var questionRef = firebase.database().ref("questions");
        this.bindAsArray(questionRef, "questions");
    },

    handleSubmit: function (e) {
        e.preventDefault();
        const input = this.refs.categoryName;
        var category = input.value;

        ref.child('Categories').child(category).set(0);
        ref.child('questions').child(category).child('material').set('Empty');
        ref.child('questions').child(category).child('questions').set('Empty');

        input.value = '';
    },

    showForm: function(e){
      e.preventDefault();
      this.open();
    },


    loadQuestionsFromCategory: function(category){
        // this.state.category = category;
        // var questionRef = firebase.database().ref("questions").child(category).child("questions");
        // this.bindAsArray(questionRef, "questions");
        // alert(questionRef);
        this.state.category = category;
        this.state.questions.forEach(function(entry) {
            if (category === entry['.key']){
                this.state.questions = entry.questions;
            }
        });
    },

    addQuestion: function(e){
      e.preventDefault();
        var questionRef = ref.child('questions').child(this.state.category).child("questions");
        var questionID = questionRef.push();
        var arr = questionID.toString().split('/');
        var id = arr[arr.length-1];
        questionID.child('text').set(this.questionText.value);
        questionID.child('img').set(id + ".png"); // todo upload to storage
        questionID.child('questionId').set(id);

        // Add answers
        var answers = [this.answer1Text.value, this.answer2Text.value, this.answer3Text.value];
        var radios = [this.answer1Radio.checked, this.answer2Radio.checked, this.answer3Radio.checked];
        var answersRef = questionID.child('answers');

        for (var i = 0; i < 3; i++){
            var answerID = answersRef.push();
            var arr = answerID.toString().split('/');
            var id = arr[arr.length-1];

            answerID.child('text').set(answers[i]);
            answerID.child('img').set(id + ".png"); // todo upload to storage
            answerID.child('isCorrect').set(radios[i]);
        }

      //   ref.child('questions').child(category).set(0);
      //   ref.child('questions').child(category).child('material').set('Empty');
        this.close();
    },
    render: function () {
        const categories = this.state.categories;
        const questions = this.state.questions;

        return (
            <div>
                <div id="categories" style={{align: "left", float: "left"}}>
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <h3 className="panel-title">Categories</h3>
                        </div>
                        <div className="list-group">
                            <CategoryList data={categories} loadQuestionsFromCategory={this.loadQuestionsFromCategory}/>

                            <div className="list-group-item">
                                <form id="user-form" name="new-category-form" className="list-group-item"
                                      onSubmit={this.handleSubmit.bind(this)}>
                                    <input className="form-control" type="text" id="name" name="new-category-name"
                                           ref="categoryName"
                                           placeholder="Enter category and press enter"/>
                                    <input type="submit" className="hidden" value="submit"/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                <div id='questions' class='pull-right col-md-6' style={{visibility: "hidden", float:"right", width:"600px"}}>
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <h3 className="panel-title">Questions: {this.state.category}</h3>
                        </div>
                        <div className="list-group">
                            <Button bsSize="medium" bsStyle="success" onClick={this.showForm}>Add question</Button>
                            <QuestionList data={questions}/>
                            {/*<div className="list-group-item">*/}
                            {/*<form id="user-form" name="new-category-form" className="list-group-item" onSubmit={this.handleSubmit.bind(this)}>*/}
                            {/*<input className="form-control" type="text" id="name" name="new-category-name"*/}
                            {/*ref="categoryName"*/}
                            {/*placeholder="Enter category and press enter"/>*/}
                            {/*<input type="submit" className="hidden" value="submit"/>*/}
                            {/*</form>*/}
                            {/*</div>*/}

                            <Modal
                                isOpen={this.state.showModal}
                                // onAfterOpen={this.afterOpenModal}
                                onRequestClose={this.close}
                                style={customStyles}
                                contentLabel="New Question Modal">


                                <Form inline>
                                    <FormGroup controlId="formInlineName">
                                        <ControlLabel>Question</ControlLabel>
                                        {' '}
                                        <FormControl inputRef={(ref) => {this.questionText = ref}} componentClass="textarea" placeholder="Question" />
                                    </FormGroup>

                                    <FormGroup>
                                        <ControlLabel>Question image</ControlLabel>
                                        <FormControl
                                            inputRef={(ref) => {this.questionImg = ref}}
                                            id="formControlsFile"
                                            type="file"
                                            label="File"
                                            help="Example block-level help text here."/>
                                    </FormGroup>


                                    <br/><br/>

                                    <FormGroup>
                                        <FormGroup controlId="formInlineName">
                                            <ControlLabel>Answer 1</ControlLabel>
                                            {' '}
                                            <FormControl inputRef={(ref) => {this.answer1Text = ref}} componentClass="textarea" placeholder="Question" />
                                        </FormGroup>
                                        <Radio name="radioGroup" inline inputRef={(ref) => {this.answer1Radio = ref}}>
                                            Is correct?
                                        </Radio>

                                        <br/><br/>
                                        {' '}
                                        <FormGroup controlId="formInlineName">
                                            <ControlLabel>Answer 2</ControlLabel>
                                            {' '}
                                            <FormControl inputRef={(ref) => {this.answer2Text = ref}} componentClass="textarea" placeholder="Question" />
                                        </FormGroup>
                                        <Radio name="radioGroup" inline inputRef={(ref) => {this.answer2Radio = ref}}>
                                            Is correct?
                                        </Radio>
                                        {' '}
                                        <br/><br/>
                                        <FormGroup controlId="formInlineName">
                                            <ControlLabel>Answer 3</ControlLabel>
                                            {' '}
                                            <FormControl inputRef={(ref) => {this.answer3Text = ref}} componentClass="textarea" placeholder="Question" />
                                        </FormGroup>
                                        <Radio name="radioGroup" inline inputRef={(ref) => {this.answer3Radio = ref}}>
                                            Is correct?
                                        </Radio>
                                    </FormGroup>

                                    <br/><br/>
                                    <Button type="submit" onClick={this.addQuestion.bind(this)}>
                                        Save
                                    </Button>
                                </Form>

                            </Modal>



                        </div>
                    </div>
                </div>

                <div class="container">

                </div>

            </div>
        );
    }
});



export default App;

