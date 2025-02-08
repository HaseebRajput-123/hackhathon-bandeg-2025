import { groq } from "next-sanity";
export const allProducts = groq`*[_type == "products"] {
    _id,
    name,
    price,
    description,
    "slugCurrent": slug.current,
    "image": image.asset->url,
    category,
    discountPercent,
    colors,
    sizes,
}`;