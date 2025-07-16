import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);

  // Fetch all food items from backend
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Failed to fetch food list');
      }
    } catch (error) {
      toast.error('Error fetching list');
      console.error(error);
    }
  };

  // Remove a food item
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // refresh the list after deletion
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      toast.error('Error removing item');
      console.error(error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img
              src={`${url}/uploads/${item.image}`}
              alt={item.name}
              style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
              onError={(e) => (e.target.src = '/default.jpg')} // fallback image
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p className="cursor" onClick={() => removeFood(item._id)}>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
