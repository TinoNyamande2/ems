import {sql} from "@vercel/postgres";
import { ProductImage,ProductImageEdit } from "@/interfaces/additional-images";

export const addImage = async (image: ProductImage) => {
  try {
    await sql`INSERT INTO images (productid,imageurl)
        VALUES (
            ${image.productid},
            ${image.imageurl},
        )`;
  } catch (error) {
    throw new Error("Error saving data to the database");
  }
  return;
};

export const editImage = async (image:ProductImageEdit) => {
  try {
    await sql`UPDATE images SET 
        imageurl=${image.imageurl},
        WHERE id =${image.id}`;
  } catch (error) {
    throw new Error("Error updating record");
  }
};

export const deleteImage = async (id: string) => {
  try {
    await sql`DELETE FROM images WHERE id=${id}`;
  } catch (error) {
    throw new Error("Error deleting record from database");
  }
};

export const getImagesByProduct = async (productid: string) => {
  try {
    const data = await sql`SELECT * FROM images WHERE product=${productid}`;
    return data.rows;
  } catch (error) {
    throw new Error("Error fetching data from database");
  }
};

export const getImageById = async (id: string) => {
  try {
    const data = await sql`SELECT * FROM images WHERE id=${id}`;
    return data.rows[0];
  } catch (error) {
    throw new Error("Error fetching data from database");
  }
};

