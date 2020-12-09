import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import query from "../queries/CurrentUser";
import mutation from "../mutations/Logout";

class Header extends Component {
  onLogout = () => {
    this.props.mutate({
      refetchQueries: [{ query }],
    });
  };
  render() {
    const { loading, user } = this.props.data;
    if (loading) return <div></div>;

    return (
      <nav>
        <div className="nav-wrapper">
          <ul className="right">
            {user ? (
              <li>
                <a onClick={this.onLogout}>Logout</a>
              </li>
            ) : (
              <div>
                <li>
                  <Link to="/signup">SignUp</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default graphql(mutation)(graphql(query)(Header));
