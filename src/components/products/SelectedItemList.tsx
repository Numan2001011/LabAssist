// components/SelectedItemList.tsx
import React from 'react';

interface SelectedItemListProps {
  selectedItems: { item_id: number; item_name: string; quantity: number }[];
  deleteSelectedItem: (itemId: number) => void;
}

function SelectedItemList({ selectedItems, deleteSelectedItem }: SelectedItemListProps): JSX.Element {
  const handleDelete = (itemId: number) => {
    deleteSelectedItem(itemId);
  };

  return (
    <div className="selected-item-list">
      <h2>Selected Items</h2>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map((item) => (
            <tr key={item.item_id} onClick={() => handleDelete(item.item_id)}>
              <td>{item.item_id}</td>
              <td>{item.item_name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SelectedItemList;
