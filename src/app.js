import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "./modal";
import { addQuestions } from "./actions";

const mapDispatchToProps = { addQuestions };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      current: 0,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  closeAndOpen = (number) => {
    this.deselectAll();
    this.setState(
      {
        showModal: false,
      },
      () => this.changeModal(number)
    );
  };

  initialize = () => {
    this.setState(
      {
        showModal: false,
        current: 0,
      },
      this.deselectAll
    );
  };

  deselectAll = () => {
    const radios = document.getElementsByTagName("input");
    for (let index = 0; index < radios.length; index++) {
      if (radios[index].type === "radio") {
        radios[index].checked = false;
      }
    }
  };

  changeModal = (number) => {
    setTimeout(() => {
      this.updateModal(true, number);
    }, 500);
  };

  updateModal = (open, question) => {
    this.setState({
      showModal: open,
      current: question,
    });
  };

  fetchData = () => {
    const { addQuestions } = this.props;
    const url =
      "http://100.24.206.116/api/v2/getCompatibilityGameQuestions/";

    fetch(url)
      .then((res) => res.json())
      .then(({ data }) => {
        addQuestions(data);
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { showModal, current } = this.state;

    return (
      <div className="container">
        <button type="button" onClick={() => this.updateModal(true, 0)}>
          Click Me
        </button>
        <Modal
          show={showModal}
          current={current}
          action={this.closeAndOpen}
          init={this.initialize}
        />
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(App);
