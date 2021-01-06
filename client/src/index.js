import React, { Component } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route } from "react-router-dom";
import { ApolloClient } from "apollo-client";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/Dashboard";
import requireAuth from "./components/requireAuth";

const cache = new InMemoryCache({
  dataIdFromObject: (object) => object.id || null,
});

const client = new ApolloClient({
  link: createHttpLink({ uri: "/graphql" }),
  cache,
});
class Root extends Component {
  render() {
    return (
      <div className="container">
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>
            <HashRouter>
              <Header />
              <Route path="/" component={requireAuth(Dashboard)} exact />
              <Route path="/login" component={LoginForm} exact />
              <Route path="/signup" component={SignupForm} exact />
            </HashRouter>
          </ApolloHooksProvider>
        </ApolloProvider>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.querySelector("#root"));
