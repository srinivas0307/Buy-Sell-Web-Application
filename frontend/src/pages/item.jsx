import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Item = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/items/get/id/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProduct(response.data);
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to fetch product details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/cart/add',
                { itemId: product._id, name: product.name, price: product.price },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(response.data.message);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add item to cart. Please try again.');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div >Loading...</div>;
    }

    if (!product) {
        return <div >No product found</div>;
    }

    return (
        <div className='page'>
            {loading && <p>Loading...</p>}
            <h2 >Item detailes</h2>
            {!product && <p>No product found</p>}
            <div className='item-card'>
                <div >
                    <img src={product.image || '/image.png'} alt='Item image' />
                    <p>
                        <span >Name: </span>
                        <span >{product.name}</span>
                    </p>
                    <p>
                        <span >Price: </span>
                        <span >Rs.{product.price}</span>
                    </p>
                    <p>
                        <span >Description: </span>
                        <span >{product.description}</span>
                    </p>
                    <p>
                        <span >Category: </span>
                        <span >{product.category}</span>
                    </p>
                    <p>
                        <span >Seller: </span>
                        <span >{product.sellername}</span>
                    </p>
                    <button onClick={handleAddToCart} >
                        Add to Cart
                    </button>
                </div>
            </div>
            <button onClick={handleGoBack} >
                Back to List
            </button>
        </div>
    );
};

export default Item;
