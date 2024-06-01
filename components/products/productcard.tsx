import { ProductEdit } from "@/interfaces/product"
import "./../../src/app/globals.css"

export const Productcard = ({ product }: { product: ProductEdit }) => {
    return (
        <div className='card' >
                <img src={product.mainimageurl} alt={product.title} className='productImage' />
                <h2>{product.title}</h2>
                <p>${product.normalprice}</p>
        </div>
    )
}