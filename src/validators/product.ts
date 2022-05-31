import { Product } from '../models/Product'

export class MissingFieldError extends Error {}

export function validateProductCreateEntry(product: Product){
    if(!product.name){
        throw new MissingFieldError('Value for name required!')
    }
    if(!product.description){
        throw new MissingFieldError('Value for description required!')
    }
    if(!product.imageUrl){
        throw new MissingFieldError('Value for imageUrl required!')
    }
    if(!product.quantity){
        throw new MissingFieldError('Value for quantity required!')
    }
    if(!product.brand){
        throw new MissingFieldError('Value for brand required!')
    }
    if(!product.sku){
        throw new MissingFieldError('Value for sku required!')
    }
    if(!product.category){
        throw new MissingFieldError('Value for category required!')
    }
}

export function validateProductUpdateEntry(product: Product){
    if(!product.name){
        throw new MissingFieldError('Value for name required!')
    }
    if(!product.description){
        throw new MissingFieldError('Value for description required!')
    }
    if(!product.imageUrl){
        throw new MissingFieldError('Value for imageUrl required!')
    }
    if(!product.quantity){
        throw new MissingFieldError('Value for quantity required!')
    }
    if(!product.brand){
        throw new MissingFieldError('Value for brand required!')
    }
    if(!product.sku){
        throw new MissingFieldError('Value for sku required!')
    }
    if(!product.category){
        throw new MissingFieldError('Value for category required!')
    }
}