import React from "react";

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  componentDidMount() {
    console.log("Component Dropdown mounted successfully with props", this.props);
  }

  click() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    var view = this.state.isOpen ?
      (Object.keys(this.props.user).map((userProp, index) => {
          return (
            <div key={index} className="col-12 middle dropdown-details space-between">
              <label className="col-4 middle">{userProp}:</label>&nbsp;
              <span className="col-6 middle">{this.props.user[userProp]}</span>
            </div>
          );
        })
      ) : null;

    return (
      <div className="col-12 dropdown">
        <button className="btn btn-primary btn-block dropdown-toggle" onClick={this.click.bind(this)}>
          {this.state.isOpen ? "Hide Details" : "Show Details"}
        </button>
        <div className="col-12 dropdown-content">
          {view}
        </div>
      </div>
    );
  }
}

export default Dropdown
