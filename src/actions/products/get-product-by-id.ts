import { tesloApi } from "../../config/api/tesloApi"
import { Gender, type Product } from "../../domain/entities/product"
import type { TesloProduct } from "../../infrastructure/interfaces/teslo-products.response"
import { ProductMapper } from "../../infrastructure/mappers/product.mappers"


const emptyProduct: Product = {
    id: "",
    title: "Nuevo producto",
    price:0,
    images: [],
    slug: "",
    gender: Gender.Unisex,
    stock:0,
    sizes: [],
    tags: [],
    description: ""
}

export const getProductById = async (id: string): Promise<Product> =>{

    if(id === "new")
        return emptyProduct;
    //console.log("getProductsByPage", {page, limit})
    try {
        
        const {data} = await tesloApi.get<TesloProduct>(`/products/${id}`)

        const product = ProductMapper.tesloProductToEntity(data)
        return product;

    } catch (error) {
        console.log(error);
        throw new Error("Error getting product by id "+id);
        
        
    }
}