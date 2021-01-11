import React, { Component } from "react";
import { graphql } from "react-apollo";

import currentUserQuery from "../queries/CurrentUser";

export default (WrappedComponent) => {
  class RequireAuth extends React.PureComponent.Component {
    shouldComponentUpdate(nextProps, nextState) {
      if (!nextProps.data.loading && !nextProps.data.user) {
        this.props.history.push("/login");
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return graphql(currentUserQuery)(RequireAuth);
};
