const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");

// Read data from the JSON file
const rawData = fs.readFileSync("data.json");
const booksData = JSON.parse(rawData);

// Define your GraphQL schema using the GraphQL Schema Definition Language (SDL).
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  
       
  type Query {
    books: [Book]
    booksByTitle(title: String): [Book]
    booksByTitleAndAuthor(title: String, author:String):[Book]
    allBooks: [Book]
  }
  type Mutation {
    addBook(title: String, author: String): Book
    deleteBook(title: String): Boolean
    updateBook(title: String, newTitle: String, newAuthor: String): Book
  }

`;

// Define a resolver function to provide the data for the books query.
const resolvers = {
  Query: {
    books: () => booksData.title,
    booksByTitle: (root, args, context, info) => {
      //args will contain parameter passed in query
      return booksData[args.title];

    },
    allBooks: () => booksData,

    booksByTitle: (_, { title }) => {
      // Assuming you have a data source like booksData
      // Filter the books based on the provided title
      const filteredBooks = booksData.filter((book) => book.title === title);
      return filteredBooks;
    },
    booksByTitleAndAuthor: (_, { title, author }) => {
      const filteredBooks = booksData.filter(
        (book) => book.title === title && book.author === author
      );
      return filteredBooks;
    },
  },
  Mutation: {
    addBook: (_, { title, author }) => {
      const newBook = { title, author };
      booksData.push(newBook);
      return newBook;
    },
    deleteBook: (_, { title }) => {
      const bookIndex = booksData.findIndex((book) => book.title === title);
  
      if (bookIndex !== -1) {
        booksData.splice(bookIndex, 1);
        return true; // Book deleted successfully
      }
  
      return false; // Book not found or deletion failed
    },
    updateBook: (_, { title, newTitle, newAuthor }) => {
      const bookIndex = booksData.findIndex((book) => book.title === title);
      if (bookIndex !== -1) {
        booksData[bookIndex] = { title: newTitle, author: newAuthor };
        return booksData[bookIndex];
      } else {
        throw new Error("Book not found");
      }
    }
    
  },


};

// Create an Apollo Server instance with your schema and resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server on a specified port.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});



// {
//   allBooks {
//     title
//     author
//   }
// }

// mutation Mutation {
// updateBook(title: "Book 2", newTitle: "New Title", newAuthor: "New Author") {
//     title
//     author
//   } 
// }

// # mutation Mutation {
// #   deleteBook(title:"Book 1")
// # }