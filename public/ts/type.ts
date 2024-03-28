/**
 *  Cart Product type 
*/
import { Product } from './interfaces';

export type CartProduct = Pick<
    Product,
    '_id' |
    'title' |
    'price' |
    'idCategory'
> & { image: string, qty: number, promotion?: number };