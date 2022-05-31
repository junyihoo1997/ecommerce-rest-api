import { Cart } from '../models/Cart'

export class MissingFieldError extends Error {}

export function validateCartCreateEntry(cart: Cart){
    if(!cart.userId){
        throw new MissingFieldError('Value for userId required!')
    }
}