export interface Cart {
    id: string,
    userId: string
}

export interface CartItem {
    id: string,
    cartId: string,
    productId: string,
    quantity: string
}