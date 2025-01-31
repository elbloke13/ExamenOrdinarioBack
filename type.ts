import {OptionalId} from "mongodb"


export type RestaurantModel = OptionalId<{
    name: string,
    direction: string,
    city: string,
    phone: string
}>;

//https://api.api-ninjas.com/v1/validatephone
export type APIPhone = {
    is_valid: boolean
}

//https://api.api-ninjas.com/v1/weather
export type APIClima = {    
    temp: number 
}


//https://api.api-ninjas.com/v1/timezone
export type APITime = {
    localtime: string
}