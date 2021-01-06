import React, { Component } from "react";
import { ApolloClient } from "apollo-client";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloProvider } from "react-apollo";
import gql from "graphql-tag";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { useQuery, useMutation } from "react-apollo-hooks";

const cache = new InMemoryCache({
  dataIdFromObject: (object) => object.id || null,
});

const client = new ApolloClient({
  link: createHttpLink({
    uri: `https://users-server-crud2.herokuapp.com/graphql`,
  }),
  cache,
});

const GET_PERSONSS = gql`
  query {
    users {
      id
      email
    }
  }
`;

const ADD_PERSONS = gql`
  mutation addUser($email: String!, $password: String!) {
    addUser(email: $email, password: $password) {
      id
    }
  }
`;

const UPDATE_PERSONS = gql`
  mutation updateUser($id: ID!, $email: String!) {
    updateUser(id: $id, email: $email) {
      id
      email
    }
  }
`;

const DELETE_PERSONS = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

function PersonsList() {
  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_PERSONSS
  );
  const [updateUser] = useMutation(UPDATE_PERSONS);
  const [deleteUser] = useMutation(DELETE_PERSONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (networkStatus === 4) return "Refetching!";

  if (data && data.users) {
    return data.users.map(({ id, email }) => {
      let input;

      return (
        <div key={id}>
          <p>{email}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUser({
                variables: { id, email: input.value },
                refetchQueries: [{ query: GET_PERSONSS, variables: { id } }],
              });
              refetch();
              input.value = "";
            }}
          >
            <input
              ref={(node) => {
                input = node;
              }}
              placeholder="Type new email"
            />
            <button className="btn" type="submit">
              Update person
            </button>
          </form>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              deleteUser({
                variables: { id },
                refetchQueries: [{ query: GET_PERSONSS, variables: { id } }],
              });
              refetch();
            }}
          >
            <button
              className="btn materialize-red btn-flat input-field"
              type="submit"
            >
              Delete person
            </button>
          </form>
        </div>
      );
    });
  }
}

function AddUser() {
  const [addUser] = useMutation(ADD_PERSONS);
  let input1;
  let input2;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addUser({
            variables: {
              email: input1.value,
              password: input2.value,
            },
            refetchQueries: [{ query: GET_PERSONSS }],
          });
        }}
      >
        <input
          ref={(node) => {
            input1 = node;
          }}
          placeholder="Type email"
        />
        <input
          ref={(node) => {
            input2 = node;
          }}
          placeholder="Type password"
        />
        <button className="btn" type="submit">
          Add person
        </button>
      </form>
    </div>
  );
}

class Dashboard extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <h4>Add persons</h4>
          <div>
            <AddUser />
            <PersonsList />
          </div>
        </ApolloHooksProvider>
      </ApolloProvider>
    );
  }
}

export default Dashboard;
