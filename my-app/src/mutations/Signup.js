import gql from 'graphql-tag'

export default gql`
mutation Signup($email: String, $password: String) {
    signup(email: $email, password: $password) {
        id
        email
      }
    }
`;

// import gql from 'graphql-tag'

// export default gql`
// mutation addUser(
//   $name: String!
//   $email: String!
//   $password: String!
//   $phone: String
//   $status: Int
// ) {
//   addUser(
//     name: $name
//     email: $email
//     password: $password
//     phone: $phone
//     status: $status
//   ) {
//     id
//   }
// }
// `;