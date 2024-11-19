import { useState, useEffect } from 'react';
import productServices from './services/products';
import './App.css';
import logo from './img/logo.png';

// Componente para encabezados
const Heading = ({ text }) => <h2>{text}</h2>;

// Componente de filtro de productos
const Filter = ({ text, value, handleChange }) => (
  <div>
    {text} <input value={value} onChange={handleChange} />
  </div>
);

// Componente de botones reutilizable
const Button = ({ type, text, handleClick }) => (
  <button type={type} onClick={handleClick}>{text}</button>
);

// Formulario para agregar productos
const ProductForm = ({ onSubmit, newProduct, handleNameChange, handlePriceChange }) => (
  <form onSubmit={onSubmit}>
    <div>
      Nombre del producto: <input value={newProduct.name} onChange={handleNameChange} />
    </div>
    <div>
      Precio: <input value={newProduct.price} onChange={handlePriceChange} />
    </div>
    <Button text="Agregar producto" type="submit" />
  </form>
);

// Componente que representa un producto individual
const Product = ({ name, price, id, addToCart, removeFromCart }) => (
  <li className="product">
    <div className="product-info">
      <h3>{name}</h3>
      <p>${price}</p>
      <Button text="Agregar al carrito" handleClick={() => addToCart(id)} />
      <Button text="Eliminar" handleClick={() => removeFromCart(id)} />
    </div>
  </li>
);

// Componente que representa el carrito de compras
const Cart = ({ cartItems, removeFromCart }) => (
  <ul>
    {cartItems.map(item => (
      <Product
        key={item.id}
        name={item.name}
        price={item.price}
        id={item.id}
        addToCart={() => {}}
        removeFromCart={removeFromCart}
      />
    ))}
  </ul>
);

// Componente de notificación (cuando se agrega o elimina un producto)
const Notification = ({ message }) => {
  if (!message) return null;
  return <div className="error">{message}</div>;
};

// Componente principal App
const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [filterText, setFilterText] = useState('');
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar formulario

  // Fetch productos iniciales desde el servicio
  useEffect(() => {
    productServices.getAll().then(initialProducts => setProducts(initialProducts));
  }, []);

  // Función para agregar un nuevo producto
  const handleAddProduct = event => {
    event.preventDefault();
    const product = { ...newProduct };

    productServices.create(product).then(returnedProduct => {
      setProducts(products.concat(returnedProduct));
      setNewProduct({ name: '', price: '' });
      setMessage(`Se agregó ${product.name}`);
      setTimeout(() => setMessage(null), 5000);
    });
  };

  // Función para agregar productos al carrito
  const addToCart = id => {
    const product = products.find(p => p.id === id);
    if (cart.find(item => item.id === id)) {
      setMessage(`${product.name} ya está en el carrito`);
    } else {
      setCart(cart.concat(product));
      setMessage(`${product.name} agregado al carrito`);
    }
    setTimeout(() => setMessage(null), 3000);
  };

  // Función para eliminar productos del carrito
  const removeFromCart = id => {
    setCart(cart.filter(item => item.id !== id));
    setMessage(`Se eliminó el producto del carrito`);
    setTimeout(() => setMessage(null), 3000);
  };

  // Funciones para manejar los cambios en los inputs
  const handleNameChange = event => setNewProduct({ ...newProduct, name: event.target.value });
  const handlePriceChange = event => setNewProduct({ ...newProduct, price: event.target.value });
  const handleFilterChange = event => setFilterText(event.target.value);

  // Filtra productos con base en el texto de búsqueda
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <header className="header">
        <img src={logo} alt="Logo" />
        <Heading text="Ceci g Cueros" />
        <Filter text="Buscar producto:" value={filterText} handleChange={handleFilterChange} />
      </header>
      <Notification message={message} />

      {/* Botón para mostrar/ocultar el formulario */}
      <Button 
        text={showForm ? "Ocultar formulario" : "Agregar un producto"} 
        handleClick={() => setShowForm(!showForm)} 
      />

      {showForm && (
        <>
          <Heading text="Agregar un producto a tu carrito" />
          <ProductForm
            onSubmit={handleAddProduct}
            newProduct={newProduct}
            handleNameChange={handleNameChange}
            handlePriceChange={handlePriceChange}
          />
        </>
      )}

      <Heading text="Productos disponibles" />
      <ul>
        {filteredProducts.map(product => (
          <Product
            key={product.id}
            name={product.name}
            price={product.price}
            id={product.id}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </ul>

      <Heading text="Carrito de compra" />
      <Cart cartItems={cart} removeFromCart={removeFromCart} />
    </div>
  );
};

export default App;
