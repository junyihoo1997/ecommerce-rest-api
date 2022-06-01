import { CartItem } from '../models/CartItem'

export class MissingFieldError extends Error {}

export function validateCartItemEntry(cartItem: CartItem){
    if(!cartItem.userId){
        throw new MissingFieldError('Value for userId required!')
    }
    if(!cartItem.productId){
        throw new MissingFieldError('Value for productId required!')
    }
    if(!cartItem.quantity){
        throw new MissingFieldError('Value for quantity required!')
    }
    if(cartItem.quantity && cartItem.quantity <= 0){
        throw new MissingFieldError('Value for quantity should not lower than 0!')
    }
}

export function validateCartItemUpdateEntry(cartItem: CartItem){
    if(!cartItem.quantity){
        throw new MissingFieldError('Value for quantity required!')
    }
    if(cartItem.quantity && cartItem.quantity <= 0){
        throw new MissingFieldError('Value for quantity should not lower than 0!')
    }
}
