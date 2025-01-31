import { Collection , ObjectId} from "mongodb";
import { RestaurantModel, APIPhone} from "./type.ts";
import { GraphQLError } from "graphql";


type addMutationArgs = {
    _id: string,
    name: string,
    direction: string,
    city: string,
    phone: string
}

type deleteMutationArgs = {
    _id: string
}

type getRestaurantsQueryArgs = {
    city:string,
}

type getRestaurantQueryArgs = {
    _id: string
} 

type RestaurantCtx = {

    RestaurantCollection: Collection<RestaurantModel>
}

export const resolvers = {


    Restaurant: {
        _id: (parent: RestaurantModel): string => parent._id!.toString()
    },

    Query: {

        getRestaurants: async (_: unknown , RestCtx: RestaurantCtx, args: getRestaurantsQueryArgs): Promise <RestaurantModel[]> => {
            const res = await RestCtx.RestaurantCollection.find({city: args.city}).toArray();
            return res;
        }

    },

    Mutation: {

        deleteRestaurant: async (_: unknown, args: deleteMutationArgs, ctx: RestaurantCtx): Promise< boolean> => {            
            const {deletedCount} = await ctx.RestaurantCollection.deleteOne({id: new ObjectId(args._id)});
            return deletedCount === 1;
        },
        addRestaurant: async (_: unknown, args: addMutationArgs , ctx: RestaurantCtx ): Promise<RestaurantModel> => {

            const APIKEY = Deno.env.get("API-KEY");
            if(!APIKEY) throw new GraphQLError("Neceistas la API-KEy");

            const {phone,name,direction,city} = args;
            const phonexists = await ctx.RestaurantCollection.countDocuments({phone})
            if(phonexists >= 1) throw new GraphQLError("El numero ya existe");

            const url =  "https://api.api-ninjas.com/v1/validatephone?number"
            
            const data = await fetch(url,
                {
                    headers: {
                        "X-Api-Key" : APIKEY
                    }
                }
            );

            if (data.status !== 200) throw new GraphQLError ("API Ninja error");

            const response: APIPhone =  await data.json();

            if(!response.is_valid) throw new GraphQLError("El formato no es valido");

            const {insertedId} = await ctx.RestaurantCollection.insertOne(
                {   
                    name,
                    direction,
                    city,
                    phone,
                }
            )


            return {

                _id: insertedId,
                name,
                direction,
                city,
                phone,
            }

        }

    }

}