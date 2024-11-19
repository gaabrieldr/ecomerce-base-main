import axios from 'axios';
const baseUrl ='http://localhost:3001/products';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const create = newObject => {
    const request = axios.post(baseUrl, newObject);
    return request.then(response => response.data);
};

const updateProduct = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
};  

const deleteProduct = id => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then(response => response.data);
};

const productServices = { getAll, create, updateProduct, deleteProduct };

export default productServices;
