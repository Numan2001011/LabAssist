// App.tsx
import { useState, useEffect } from 'react';
import ItemList from './ItemList';
import SelectedItemList from './SelectedItemList';
import axios from 'axios'; // You'll need to install axios: npm install axios

const Items = () => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  useEffect(() => {
    fetchSelectedItems();
  }, []);

  const fetchSelectedItems = async () => {
    try {
      const response = await axios.get('/api/selectedItems');
      setSelectedItems(response.data);
    } catch (error) {
      console.error('Error fetching selected items:', error);
    }
  };

  const addToSelectedItems = async (item: any) => {
    try {
      await axios.post('/api/selectedItems', item);
      fetchSelectedItems(); // Refresh selected items after adding
    } catch (error) {
      console.error('Error adding selected item:', error);
    }
  };

  const deleteSelectedItem = async (itemId: number) => {
    try {
      await axios.delete(`/api/selectedItems/${itemId}`);
      fetchSelectedItems(); // Refresh selected items after deletion
    } catch (error) {
      console.error('Error deleting selected item:', error);
    }
  };

  return (
    <div className="app">
      <div className="left-partition">
        <ItemList addToSelectedItems={addToSelectedItems} />
      </div>
      <div className="right-partition">
        <SelectedItemList selectedItems={selectedItems} deleteSelectedItem={deleteSelectedItem} />
      </div>
    </div>
  );
}

export default Items;
