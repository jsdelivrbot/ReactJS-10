import React from 'react';
import ReactDOM from 'react-dom';
import UserList from 'app/scripts/components/userList';
import Subscriber from 'app/scripts/flux/Subscriber';

(() => {
  class App extends React.Component {
    constructor() {
      super();
      this.users = [
        {id: 1, firstname: "Taner", surname: "Gokalp", country: "Turkey", age: 25, gender: "Male"},
        {id: 2, firstname: "John", surname: "Doe", country: "United States", age: 20, gender: "Male"},
        {id: 3, firstname: "François", surname: "Bregerie", country: "France", age: 35, gender: "Male"},
        {id: 4, firstname: "Francesco", surname: "Potelli", country: "Italy", age: 40, gender: "Male"},
        {id: 5, firstname: "Fabian", surname: "Zilinski", country: "Germany", age: 25, gender: "Male"}
      ];

      this.store = new Subscriber().createStore("UserList").getStore("UserList");
      this.state = {
        users: this.users.slice()
      };
    }

    componentDidMount() {
      console.log("Component App mounted successfully");
      this.store.subscribe("filter", (filterStr) => {
        var regExp = new RegExp(filterStr.toLowerCase());
        var filteredUsers = this.users.filter(user => {
          return regExp.test(user.firstname.toLowerCase());
        });
        console.log("Re-rendering after filter with data", filteredUsers);

        this.setState({
          users: filteredUsers
        });
      });

      this.store.subscribe("add", (newUserData) => {
        this.users = this.users.concat([newUserData]);
        console.log("Re-rendering after add with data", this.users);

        this.setState({
          users: this.users
        });
      });

      this.store.subscribe("delete", (userIndex) => {
        this.users.splice(userIndex, 1);
        console.log("Re-rendering after delete with data", this.users);

        this.setState({
          users: this.users
        });
      });

      this.store.subscribe("update", (updatedUser) => {
        this.users[updatedUser.order] = updatedUser.data;
        console.log("Re-rendering after update with data", this.users);

        this.setState({
          users: this.users
        });
      });
    }

    render() {
      return (<UserList users={this.state.users} />);
    }
  }
  /* start application */
  ReactDOM.render(<App />, document.getElementById("app"));
})();
