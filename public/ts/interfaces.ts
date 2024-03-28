/**
 * @description Category interface
 * @interface Category
 * @property {number} id - Category id
 * @property {string} title - Category title
 * @property {string} background - Category background
 * @property {string} description - Category description
 * @property {boolean} show - Category show
 * @property {string} description - Category description
 * @property {boolean} show - Category show
 */
export interface Category {
    _id: string;
    name: string;
    banner: string;
    description: string;
    show: boolean;
}

/** 
 * @description Image interface
 * @interface Image
 * @property {string} src - Image source
 * @property {string} alt - Image alt
 */
interface Image {
    src: string;
    alt: string;
}

/** 
 * @description Product interface
 * @interface Product
 * @property {number} viewed - Product id
 * @property {string} id - Product id
 * @property {string} idCategory - Category id
 * @property {string} title - Product title
 * @property {number} price - Product price
 * @property {object} background - Product background
 * @property {string} background.main - Product main background
 * @property {string} background.sub - Product sub background
 * @property {string} background.lazy - Product lazy background
 * @property {Image[]} thumbnails - Product thumbnails
 * @property {number} salePrice - Product sale price
 * @property {boolean} show - Product show
 * @property {string} description - Product description
 */
export interface Product {
    _id: string;
    idCategory: {
        _id: string,
        name: string
    };
    title: string;
    price: number;
    background: {
        main: string;
        sub: string;
        lazy: string;
    };
    thumbnails: Image[];
    salePrice: number;
    show: boolean;
    description: string[];
    stock: number;
    viewed: number;
}

/** 
 * @description User interface
 * @interface User
 * @property {number} id - User id
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {string} token - User token
 */
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    token: string;
}

// interface UserOption {
//     name: string;
//     link: string;
//     handler?: () => void;
// }

// interface UserOptions {
//     guest: UserOption[];
//     user: UserOption[];
// }


export interface Data_Image {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: number
}