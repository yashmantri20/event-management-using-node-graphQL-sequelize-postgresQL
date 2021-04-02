const { gql } = require("apollo-server-express");

module.exports = gql`
  input Pagination {
    page: Int
    pagesize: Int
    sort: OrderBy
    search: SearchBy
  }

  input OrderBy {
    sortbyvalue: value
    sorttype: Sort
  }

  input SearchBy {
    searchbyvalue: value
    text: String
  }

  enum value {
    id
    eventName
    date
  }

  enum Sort {
    ASC
    DESC
  }
`;
