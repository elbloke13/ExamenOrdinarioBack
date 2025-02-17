export const schema = `

    type Restaurant{
        _id: ID!,
        name: String!,
        direction: String!,
        city: String!,
        phone: String!
    }


    type Query{
        getRestaurant (id: ID!): Restaurant
        getRestaurants (city: String!): Restaurant
    }



    type Mutation{
        addRestaurant(name: String!, direction: String!, city: String!, phone: String!): Restaurant!
        deleteRestaurant(id: ID!): Boolean!
    }


`