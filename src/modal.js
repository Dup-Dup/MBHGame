import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { addAnswer, emptyAnswers } from "./actions";
import "./style.css";

const mapStateToProps = (state) => ({
  questions: state.questions,
  answers: state.answers,
});

const mapDispatchToProps = { addAnswer, emptyAnswers };

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: 1,
      selectedIndex: -1,
      username: "",
      email: "",
    };
  }

  componentDidUpdate(prevProps) {
    const { current, answers } = this.props;
    const { current: prevCurrent } = prevProps;
    if (answers[current] && current !== prevCurrent) {
      this.setState({ selectedIndex: answers[current].position });
    }
  }

  onChangeValue = (e, index) => {
    const { addAnswer, current, questions } = this.props;
    addAnswer({
      position: current,
      answer: e.target.value,
      selected: index,
      qID: questions[current].id,
    });
    this.setState({ selectedIndex: index });
  };

  goBack = () => {
    const { current, action } = this.props;
    this.setState({ selectedIndex: -1 }, () => action(current - 1));
  };

  goFront = () => {
    const { current, action, questions } = this.props;
    if (current + 1 < questions.length) {
      this.setState({ selectedIndex: -1 }, () => action(current + 1));
    } else {
      this.setState({ phase: 2 });
    }
  };

  postData = () => {
    const { username, email } = this.state;
    const { answers } = this.props;
    const ansResp = [];
    const qids = [];
    answers.forEach(({ answer, qID }) => {
      ansResp.push(answer);
      qids.push(qID);
    });
    const url =
      "http://100.24.206.116/api/v2/getCompatibilityGameQuestions/";
    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        answers: ansResp,
        question_ids: qids,
      }),
    }).then((res) => {
      alert("User data saved successfully");
    });
  };

  closeModalAction = () => {
    const { emptyAnswers, init } = this.props;
    emptyAnswers();
    init();
  };

  render() {
    const { show, questions, current } = this.props;
    const { selectedIndex, phase } = this.state;

    return (
      <div
        style={{ display: `${show ? "block" : "none"}` }}
        className="main-modal"
      >
        {phase === 1 && questions && questions.length > 0 && (
          <Fragment>
            <span className="numbering">
              {current + 1}&nbsp;/&nbsp;{questions.length}
            </span>
            <span className="btn-cross" onClick={this.closeModalAction}>
              X
            </span>
            {questions[current].image_url !== "" && (
              <img
                src={questions[current].image_url}
                alt="cover"
                className="ques-img"
              />
            )}
            <div className="title">{questions[current].question}</div>
            <div>
              {questions[current].options.map((option, index) => (
                <div
                  key={index}
                  onChange={(e) => this.onChangeValue(e, index)}
                  className={`option-sec ${
                    index === selectedIndex ? "selected-sec" : ""
                  }`}
                >
                  <input
                    id={`id-${index}-option`}
                    type="radio"
                    value={`${option}`}
                    name={`name${current}`}
                  />
                  <label htmlFor={`id-${index}-option`}>{option}</label>
                </div>
              ))}
            </div>
            <div className="btm-btn-grp">
              {/* {current !== 0 && (
                <button
                  type="button"
                  className="btn-back"
                  onClick={this.goBack}
                >
                  Go back
                </button>
              )} */}
              <button
                type="button"
                className="btn-next"
                onClick={this.goFront}
                disabled={selectedIndex === -1}
              >
                Next
              </button>
            </div>
          </Fragment>
        )}
        {phase === 2 && (
          <div className="input-holder">
            <input
              type="text"
              placeholder="username"
              className="input-field"
              onChange={(e) => this.setState({ username: e.target.value })}
            />
            <input
              type="email"
              placeholder="email"
              className="input-field"
              onChange={(e) => this.setState({ email: e.target.value })}
            />
            <button type="button" className="btn-next" onClick={this.postData}>
              Show my test result
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
