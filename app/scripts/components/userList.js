import React from "react";
import User from "/dist/app/scripts/components/user";
import Subscriber from "dist/app/scripts/flux/Subscriber";

var timeout;

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddingNewUser: false
    };
    this.store = new Subscriber().getStore("UserList");
  }

  componentDidMount() {
    console.log("Component UserList mounted successfully with props :", this.state.users);
  }

  addNewUser() {
    this.setState({
      isAddingNewUser: true
    });
  }

  saveNewUser() {
    var newUser = {};
    var inputs = document.getElementById("newUserForm").querySelectorAll("input[type=text]");
    Array.prototype.slice.call(inputs, 0).forEach((input) => {
      newUser[input.getAttribute("name")] = input.value;
    });

    this.setState({
      isAddingNewUser: false
    });
    console.log("Sending message to store ", this.store);
    this.store.publish("add", newUser);
  }

  cancel() {
    this.setState({
      isAddingNewUser: false
    });
  }

  searchUser(e) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log("Sending message to store ", this.store);
      this.store.publish("filter", e.target.value);
    }, 1000);
  }

  _render() {
    if (this.state.isAddingNewUser) {
      return(
        <div id="newUserForm" className="form col-12">
          <div className="col-12 space-between"><label className="col-3 middle">First Name:</label><input className="col-7 input-text" type="text" name="firstname" /></div>
          <div className="col-12 space-between"><label className="col-3 middle">Surname:</label><input className="col-7 input-text" type="text" name="surname" /></div>
          <div className="col-12 space-between"><label className="col-3 middle">Country:</label><input className="col-7 input-text" type="text" name="country" /></div>
          <div className="col-12 space-between"><label className="col-3 middle">Age:</label><input className="col-7 input-text" type="text" name="age" /></div>
          <div className="col-12 space-between"><label className="col-3 middle">Gender:</label><input className="col-7 input-text" type="text" name="gender" /></div>
          <div className="col-12 middle space-between">
            <button className="btn-lg btn-primary" onClick={this.saveNewUser.bind(this)}>Save</button>
            <button className="btn-lg btn-default" onClick={this.cancel.bind(this)}>Cancel</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-12 column userList-top">
          <button className="btn-lg btn-block btn-primary add-button" onClick={this.addNewUser.bind(this)}>Add New User</button><br />
          <input className="search-user input-text" type="text" placeholder="Search User By Name" onChange={this.searchUser.bind(this)} />
        </div>
      );
    }
  }

  render() {
    var usersAsNodes = this.props.users.map((user, index) => {
      return (<User key={index} order={index} userData={user} />);
    });
    var view = this._render();
    return (
      <div className="col-12 userList">
        {view}
        {usersAsNodes}
      </div>
    );
  }
}

export default UserList
