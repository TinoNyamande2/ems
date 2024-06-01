import { ProductCreate, ProductEdit } from "@/interfaces/product";
import {sql} from "@vercel/postgres";

export const createProduct = async (product: ProductCreate) => {
  try {
    await sql`INSERT INTO products (title,category,tags,description,mainimageurl,userid,saleprice,normalprice,delivery)
        VALUES (
            ${product.title},
            ${product.category},
            ${product.tags},
            ${product.description},
            ${product.mainimageurl},
            ${product.userid},
            ${product.saleprice},
            ${product.normalprice},
            ${product.delivery}
        )`;
  } catch (error) {
    throw new Error("Error saving data to the database");
  }
  return;
};

export const editProduct = async (product: ProductEdit) => {
  try {
    await sql`UPDATE products SET 
        normalprice=${product.normalprice},
        saleprice =${product.saleprice},
        delivery=${product.delivery},
        title=${product.title},
        description=${product.description},
        category =${product.category},
        tags=${product.tags}
        mainimageurl=${product.mainimageurl}
        WHERE id =${product.id}`;
  } catch (error) {
    throw new Error("Error updating record");
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await sql`DELETE FROM products WHERE id=${id}`;
  } catch (error) {
    throw new Error("Error deleting record from database");
  }
};

export const getProductsByUserId = async (userid: string) => {
  try {
    const data = await sql`SELECT * FROM products WHERE userid=${userid}`;
    return data.rows;
  } catch (error) {
    throw new Error("Error fetching data from database");
  }
};

export const getProductById = async (id: string) => {
  try {
    const data = await sql`SELECT * FROM products WHERE id=${id}`;
    return data.rows[0];
  } catch (error) {
    throw new Error("Error fetching data from database");
  }
};

export const getProducts = async (category: string, tags: string) => {
  try {
    if (category && tags) {
      const data =
        await sql`SELECT * FROM products WHERE category=${category} AND tags ILIKE ${`%${tags}%`} ||
            title ILIKE ${`%${tags}%`} || description ILIKE ${`%${tags}%`} `;
      return data.rows;
    } else if (category && !tags) {
      const data = await sql`SELECT * FROM products WHERE category=${category}`;
      return data.rows;
    } else if (!category && tags) {
      const data =
        await sql`SELECT * FROM products WHERE tags ILIKE ${`%${tags}%`} ||
            title ILIKE ${`%${tags}%`} || description ILIKE ${`%${tags}%`} `;
      return data.rows;
    } else {
      const data = await sql`SELECT * FROM products`;
      return data.rows;
    }
  } catch (error) {
    throw new Error("Error fetching data from the database");
  }
};
