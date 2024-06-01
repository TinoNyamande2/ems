import { ProductEdit } from "@/interfaces/product"
import { Productcard } from "./productcard"
import "./../../src/app/globals.css"


export const ProductsContainer = () =>{
    const products :ProductEdit[] = [
        {   id:"1",
            title :"Product 1",
            category:"Category 1",
            tags:"Type 1",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at felis eu ante mattis ultricies. Proin id neque eget nulla consequat efficitur. Sed consequat mauris euismod, euismod nulla vitae, tristique lorem. Quisque dapibus dui sed ante consectetur, sed ultricies enim eleifend. Fusce sit amet lobortis enim. Donec eget lorem eu sapien volutpat sagittis non at libero. Suspendisse potenti.",
            normalprice:"1.09",
            saleprice:"1.00",
            delivery:"Local",
            mainimageurl:"https://github.com/TinoNyamande/Machine_learning/blob/main/download.jpg?raw=true",
            userid:"Test User Id"
        },
        {   id:"2",
        title :"Product 1",
        category:"Category 1",
        tags:"Type 1",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at felis eu ante mattis ultricies. Proin id neque eget nulla consequat efficitur. Sed consequat mauris euismod, euismod nulla vitae, tristique lorem. Quisque dapibus dui sed ante consectetur, sed ultricies enim eleifend. Fusce sit amet lobortis enim. Donec eget lorem eu sapien volutpat sagittis non at libero. Suspendisse potenti.",
        normalprice:"1.09",
        saleprice:"1.00",
        delivery:"Local",
        mainimageurl:"https://github.com/TinoNyamande/Machine_learning/blob/main/download.jpg?raw=true",
        userid:"Test User Id"
    },
    {   id:"3",
    title :"Product 1",
    category:"Category 1",
    tags:"Type 1",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at felis eu ante mattis ultricies. Proin id neque eget nulla consequat efficitur. Sed consequat mauris euismod, euismod nulla vitae, tristique lorem. Quisque dapibus dui sed ante consectetur, sed ultricies enim eleifend. Fusce sit amet lobortis enim. Donec eget lorem eu sapien volutpat sagittis non at libero. Suspendisse potenti.",
    normalprice:"1.09",
    saleprice:"1.00",
    delivery:"Local",
    mainimageurl:"https://github.com/TinoNyamande/Machine_learning/blob/main/download.jpg?raw=true",
    userid:"Test User Id"
},
{   id:"4",
title :"Product 1",
category:"Category 1",
tags:"Type 1",
description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at felis eu ante mattis ultricies. Proin id neque eget nulla consequat efficitur. Sed consequat mauris euismod, euismod nulla vitae, tristique lorem. Quisque dapibus dui sed ante consectetur, sed ultricies enim eleifend. Fusce sit amet lobortis enim. Donec eget lorem eu sapien volutpat sagittis non at libero. Suspendisse potenti.",
normalprice:"1.09",
saleprice:"1.00",
delivery:"Local",
mainimageurl:"https://github.com/TinoNyamande/Machine_learning/blob/main/download.jpg?raw=true",
userid:"Test User Id"
},
{   id:"5",
title :"Product 1",
category:"Category 1",
tags:"Type 1",
description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at felis eu ante mattis ultricies. Proin id neque eget nulla consequat efficitur. Sed consequat mauris euismod, euismod nulla vitae, tristique lorem. Quisque dapibus dui sed ante consectetur, sed ultricies enim eleifend. Fusce sit amet lobortis enim. Donec eget lorem eu sapien volutpat sagittis non at libero. Suspendisse potenti.",
normalprice:"1.09",
saleprice:"1.00",
delivery:"Local",
mainimageurl:"https://github.com/TinoNyamande/Machine_learning/blob/main/download.jpg?raw=true",
userid:"Test User Id"
},
{   id:"6",
title :"Product 1",
category:"Category 1",
tags:"Type 1",
description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at felis eu ante mattis ultricies. Proin id neque eget nulla consequat efficitur. Sed consequat mauris euismod, euismod nulla vitae, tristique lorem. Quisque dapibus dui sed ante consectetur, sed ultricies enim eleifend. Fusce sit amet lobortis enim. Donec eget lorem eu sapien volutpat sagittis non at libero. Suspendisse potenti.",
normalprice:"1.09",
saleprice:"1.00",
delivery:"Local",
mainimageurl:"https://github.com/TinoNyamande/Machine_learning/blob/main/download.jpg?raw=true",
userid:"Test User Id"
},
{   id:"7",
title :"Product 1",
category:"Category 1",
tags:"Type 1",
description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at felis eu ante mattis ultricies. Proin id neque eget nulla consequat efficitur. Sed consequat mauris euismod, euismod nulla vitae, tristique lorem. Quisque dapibus dui sed ante consectetur, sed ultricies enim eleifend. Fusce sit amet lobortis enim. Donec eget lorem eu sapien volutpat sagittis non at libero. Suspendisse potenti.",
normalprice:"1.09",
saleprice:"1.00",
delivery:"Local",
mainimageurl:"https://github.com/TinoNyamande/Machine_learning/blob/main/download.jpg?raw=true",
userid:"Test User Id"
},
{   id:"8",
title :"Product 1",
category:"Category 1",
tags:"Type 1",
description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at felis eu ante mattis ultricies. Proin id neque eget nulla consequat efficitur. Sed consequat mauris euismod, euismod nulla vitae, tristique lorem. Quisque dapibus dui sed ante consectetur, sed ultricies enim eleifend. Fusce sit amet lobortis enim. Donec eget lorem eu sapien volutpat sagittis non at libero. Suspendisse potenti.",
normalprice:"1.09",
saleprice:"1.00",
delivery:"Local",
mainimageurl:"https://github.com/TinoNyamande/Machine_learning/blob/main/download.jpg?raw=true",
userid:"Test User Id"
},
{   id:"9",
title :"Product 1",
category:"Category 1",
tags:"Type 1",
description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at felis eu ante mattis ultricies. Proin id neque eget nulla consequat efficitur. Sed consequat mauris euismod, euismod nulla vitae, tristique lorem. Quisque dapibus dui sed ante consectetur, sed ultricies enim eleifend. Fusce sit amet lobortis enim. Donec eget lorem eu sapien volutpat sagittis non at libero. Suspendisse potenti.",
normalprice:"1.09",
saleprice:"1.00",
delivery:"Local",
mainimageurl:"https://github.com/TinoNyamande/Machine_learning/blob/main/download.jpg?raw=true",
userid:"Test User Id"
},
{   id:"10",
title :"Product 1",
category:"Category 1",
tags:"Type 1",
description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at felis eu ante mattis ultricies. Proin id neque eget nulla consequat efficitur. Sed consequat mauris euismod, euismod nulla vitae, tristique lorem. Quisque dapibus dui sed ante consectetur, sed ultricies enim eleifend. Fusce sit amet lobortis enim. Donec eget lorem eu sapien volutpat sagittis non at libero. Suspendisse potenti.",
normalprice:"1.09",
saleprice:"1.00",
delivery:"Local",
mainimageurl:"https://github.com/TinoNyamande/Machine_learning/blob/main/download.jpg?raw=true",
userid:"Test User Id"
},
    ]
    return (
        <div className='grid'>
          {products.map(product => (
            <div key={product.id} className='card'>
              <img src={product.mainimageurl} alt={product.title} className='productImage' />
              <h2>{product.title}</h2>
              <p>${product.normalprice}</p>
            </div>
          ))}
        </div>
    )
}