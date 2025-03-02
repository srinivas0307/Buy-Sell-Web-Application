import React, { useState } from 'react';
import axios from 'axios';

const AddItem = () => {
    const [itemname, setItemname] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const categories = ['Electronics', 'Clothing', 'Books', 'Grocery', 'Others'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/items/add', {
                name: itemname,
                price,
                category,
                description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Item added successfully');
            setItemname('');
            setPrice('');
            setCategory('');
            setDescription('');
        } catch (error) {
            console.error('Error adding item', error);
            alert(error.response?.data?.message || 'Error adding item. Please try again.');
        }
    };

    return (
        <div className='page'>
            <h1>Add Item</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Item Name" value={itemname} onChange={(e) => setItemname(e.target.value)} required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
};

export default AddItem;
