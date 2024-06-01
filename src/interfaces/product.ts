export interface ProductCreate {
    title :string,
    category:string,
    tags:string,
    description:string,
    normalprice:string,
    saleprice:string,
    delivery:string,
    mainimageurl:string,
    userid:string,
}

export interface ProductEdit {
    id:string,
    title :string,
    category:string,
    tags:string,
    description:string,
    normalprice:string,
    saleprice:string,
    delivery:string,
    mainimageurl:string,
    userid:string
}

export const ProductCreateDefaultvalues:ProductCreate= {
    title :"",
    category:"",
    tags:"",
    description:"",
    normalprice:"",
    saleprice:"",
    delivery:"",
    mainimageurl:"",
    userid:"",
}

export const ProductEditDefaultValues :ProductEdit= {
    id:"",
    title :"",
    category:"",
    tags:"",
    description:"",
    normalprice:"",
    saleprice:"",
    mainimageurl:"",
    userid:"",
    delivery:"",
}