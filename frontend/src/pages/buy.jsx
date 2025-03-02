import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Buy = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [error, setError] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/items/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setItems(response.data);
                setFilteredItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
                setError('Failed to fetch items. Please try again later.');
            }
        };

        fetchItems();
        setCategories(['Electronics', 'Books', 'Grocery', 'Clothing', 'Others']);
    }, []);

    useEffect(() => {
        let filtered = items;

        if (searchTerm) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((item) =>
                selectedCategories.some((category) => item.category === category)
            );
        }

        setFilteredItems(filtered);
    }, [searchTerm, selectedCategories, items]);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSearchTerm('');
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="page">
            <h2 className="title">Search Items</h2>
            <div className="buy-header">
                <div className="search-container">
                    <input type="text" placeholder="Search for items" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                </div>
                <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="filter-button">
                    {isFilterOpen ? 'Close Filters' : 'Filter'}
                </button>
            </div>


            {isFilterOpen && (
                <div className="filter-section">
                    <div className="filter-header">
                        <h4>Filter by Categories</h4>
                        <button onClick={clearFilters} className="clear-filters">Clear All</button>
                    </div>
                    <div className="category-filters">
                        {categories.map((category) => (
                            <label key={category} className="category-label">
                                <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => handleCategoryChange(category)} className="category-checkbox" />
                                {category}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div className="item-grid">
                {filteredItems.length === 0 ? (
                    <div className="no-items">No items found</div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item._id} className="item-card">
                            <h4 className="item-title">{item.name}</h4>
                            <p>Price: Rs.{item.price}</p>
                            <p>Vendor: {item.sellername}</p>
                            <Link to={`/items/${item._id}`} className="view-details-button">
                                View Details
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Buy;
