import {Dimensions} from 'react-native';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

export const CID = 'OU4YzqRrGL0nQU24jnCMswdXSLQH2wsR2qrFjquZYB';
export const CSID = 'f6UR0No979Eqrqv797qvrUlzeV7t4C8WJixvxg4RRr';
export const TYPE = 'client_credentials';


export const AUTH_API = 'https://api.moltin.com/oauth/access_token';
export const PRODUCTS_API = 'https://api.moltin.com/v2/products';
export const PRODUCTS_FILTER_CATEGORY = 'https://api.moltin.com/v2/products?filter=eq(category.id,';

export const IMAGE_PREFIX = 'https://s3-eu-west-1.amazonaws.com/bkt-svc-files-cmty-api-moltin-com/ef4e860a-1d01-4e5c-a6a8-427cfa48a668/';
export const IMAGE_SUFFIX = '.jpg';
