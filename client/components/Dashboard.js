import React, { Component } from "react";
import { render } from "react-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider, useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Header from './Header'

const client = new ApolloClient({
    uri: `https://login-apollo.herokuapp.com/graphql`
});

const GET_DOGS = gql`
  query {
    users {
      id
      email
      name
    }
  }
`;

// client.query(
//   {
//     query: GET_DOGS
// }).then((response) => {alert(JSON.stringify(response.data))}
// );

const ADD_USER = gql`
  mutation addUser(
    $name: String!
    $email: String!
    $password: String!
    $phone: String
    $status: Int
  ) {
    addUser(
      name: $name
      email: $email
      password: $password
      phone: $phone
      status: $status
    ) {
      id
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateUser($id: ID!, $name: String!) {
    updateUser(id: $id, name: $name) {
      id
      email
      name
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

function DogsList() {
    const { loading, error, data, refetch, networkStatus } = useQuery(GET_DOGS);
    const [updateUser] = useMutation(UPDATE_TODO);
    const [deleteUser] = useMutation(DELETE_USER);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (networkStatus === 4) return "Refetching!";

    return data.users.map(({ id, name, email }) => {
        let input;

        return (
            <div key={id}>
                <p>{email}</p>
                <p>{name}</p>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        updateUser({
                            variables: { id, name: input.value },
                            refetchQueries: [{ query: GET_DOGS, variables: { id } }]
                        });
                        refetch();
                        input.value = "";
                    }}
                >
                    <input
                        ref={node => {
                            input = node;
                        }}
                    />
                    <button type="submit">Update User</button>
                </form>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        deleteUser({
                            variables: { id },
                            refetchQueries: [{ query: GET_DOGS, variables: { id } }]
                        });
                        refetch();
                    }}
                >
                    <button type="submit">Delete Todo</button>
                </form>
            </div>
        );
    });
}

function AddUser() {
    // const { loading, error, data, refetch, networkStatus } = useQuery(GET_DOGS);
    const [addUser] = useMutation(ADD_USER);
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error :(</p>;
    // if (networkStatus === 4) return 'Refetching!';

    // return data.users.map(({ id, name }) => {
    let input1;
    let input2;
    let input3;
    let input4;
    let input5;

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    addUser({
                        variables: {
                            name: input1.value,
                            email: input2.value,
                            password: input3.value,
                            phone: input4.value,
                            status: input5.value
                        },
                        refetchQueries: [{ query: GET_DOGS }]
                    });
                    // refetch();
                }}
            >
                <input
                    ref={node => {
                        input1 = node;
                    }}
                />
                <input
                    ref={node => {
                        input2 = node;
                    }}
                />
                <input
                    ref={node => {
                        input3 = node;
                    }}
                />
                <input
                    ref={node => {
                        input4 = node;
                    }}
                />
                <input
                    ref={node => {
                        input5 = node;
                    }}
                />
                <button type="submit">Add user</button>
            </form>
        </div>
    );
    // }
    // );
}

// const GET_DOG_PHOTO = gql`
//   query dog($breed: String!) {
//     dog(breed: $breed) {
//       id
//       displayImage
//     }
//   }
// `;

// function DogPhoto({ breed }) {
//   const { loading, error, data, refetch, networkStatus } = useQuery(
//     GET_DOG_PHOTO,
//     {
//       variables: { breed },
//       notifyOnNetworkStatusChange: false
//       //pollInterval za automatsko refetchovanje
//       // pollInterval: 1500
//     }
//   );

//   if (networkStatus === 4) return "Refetching!";
//   if (loading) return null;
//   if (error) return `Error!: ${error}`;

//   return (
//     <div>
//       <button onClick={() => refetch()}>Refetch</button>
//       <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
//     </div>
//   );
// }

class Dashboard extends Component {
    state = { selectedDog: null };

    // onDogSelected = ({ target }) => {
    //   this.setState(() => ({ selectedDog: target.value }));
    // };

    render() {
        return (
            <ApolloProvider client={client}>
                {/* <Header /> */}
                <div>
                    {/* {this.state.selectedDog && (
            <DogPhoto breed={this.state.selectedDog} />
          )} */}
                    <AddUser />
                    <DogsList
                    // onDogSelected={this.onDogSelected}
                    // chagleListItem={this.chagleListItem}
                    />
                </div>
            </ApolloProvider>
        );
    }
}

export default Dashboard;
