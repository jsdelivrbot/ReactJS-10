import React from "react";
import Dropdown from "app/scripts/components/dropdown";
import Subscriber from "app/scripts/flux/Subscriber";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inEditMode: false
    };
    this.store = new Subscriber().getStore("UserList");
  }

  componentDidMount() {
    console.log("Component user mounted successfully with props :", this.props);
  }

  doubleClick() {
    if (this.state.inEditMode) {
        var newUser = {};
        var formInputs = document.getElementById("userEditForm").querySelectorAll("input[type=text]");
        Array.prototype.slice.call(formInputs, 0).forEach((input) => {
          newUser[input.name] = input.value;
        });
        console.log("Sending update message to store", this.store.name);
        this.store.publish("update", {data: newUser, order: this.props.order});
    }
    this.setState({
      inEditMode: !this.state.inEditMode
    });
  }

  whenDeleted() {
    console.log("Sending delete message to store ", this.store.name);
    this.store.publish("delete", this.props.order);
  }

  _render() {
    if (this.state.inEditMode) {
      var inputsAsNodes = Object.keys(this.props.userData).map((userDataProp) => {
        return (
            <div className="col-12">
              <label>{userDataProp} :</label>&nbsp;
              <input type="text" name={userDataProp} defaultValue={this.props.userData[userDataProp]} />
            </div>
        );
      });

      return (
        <div id="userEditForm" className="col-12">
          {inputsAsNodes}
        </div>
      );
    } else {
      return (
        <div className="col-12 user">
          <h4 className="col-12 center middle space-between title">
            <span className="flex title-message">Hi There, I am&nbsp;{this.props.userData.firstname}</span>
            <button className="btn-sm btn-danger title-close-button" onClick={this.whenDeleted.bind(this)}>X</button>
          </h4>
          <div className="col-12 body">
            <span className="col-12 body-message">
              I am from&nbsp;{this.props.userData.country}&nbsp;
              {this.props.userData.country === "Turkey" ? <strong>(Cool Mate!)</strong> : null}
            </span>
          </div>
          <Dropdown key={this.props.order} user={this.props.userData} />
        </div>
      );
    }
  }

  render() {
      var view = this._render();
    return (
      <div className="col-12" onDoubleClick={this.doubleClick.bind(this)}>
        {view}
      </div>
    );
  }
}

export default User
