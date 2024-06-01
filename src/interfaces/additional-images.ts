export interface ProductImage {
    productid:string,
    imageurl:string
}

export interface ProductImageEdit{
    id:string,
    productid:string,
    imageurl:string
}

export const ProductImageDefaultValues ={
    productid:"",
    imageurl:""
}

export const ProductImageEditDefaultValues = {
    id:"",
    productid:"",
    imageurl:""
}