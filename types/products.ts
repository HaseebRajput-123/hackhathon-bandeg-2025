
export interface Products {
    image: any;
    slugCurrent: any;
    category: string;
    _id: string;
    productname: string,
    _type : "products";
    name: string;
    price: number;
    quantity: number;
    description: string;
    public? :{
        images : {
            _ref : string;
            _type : "images";
        }
    }; 
    slug: {
        _type : "slug"
        current : "string";
    }
    discountPercent: number;
}