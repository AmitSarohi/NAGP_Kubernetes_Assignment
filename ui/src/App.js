import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', quantity: '' });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios
      .get(API_URL)
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item.id);
    setFormData({ name: item.name, quantity: item.quantity });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/${editItem}`, formData);
      setEditItem(null);
      setFormData({ name: '', quantity: '' });
      fetchItems();
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  const handleAdd = async () => {
    try {
      if (!formData.name.trim()) return alert("Name is required");
      await axios.post(API_URL, formData);
      setFormData({ name: '', quantity: '' });
      fetchItems();
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Inventory Manager</h1>

      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id} className="item">
            <div>
              <strong>{item.name}</strong> (Qty: {item.quantity})
            </div>
            <div className="actions">
              <button className="btn edit" onClick={() => handleEdit(item)}>Edit</button>
              <button className="btn delete" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="form-section">
        <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
        <input
          type="text"
          className="input"
          value={formData.name}
          placeholder="Item name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          className="input"
          value={formData.quantity}
          placeholder="Quantity"
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        />
        {editItem ? (
          <button className="btn update" onClick={handleUpdate}>Update</button>
        ) : (
          <button className="btn add" onClick={handleAdd}>Add</button>
        )}
      </div>
    </div>
  );
}

export default App;
