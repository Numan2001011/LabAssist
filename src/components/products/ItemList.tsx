// components/ItemList.tsx
import React from 'react';
import Item from './Item';

const items = [
  { item_id: 1, item_name: 'Item 1' },
  { item_id: 2, item_name: 'Item 2' },
  // Add more items as needed
];

interface ItemListProps {
  addToSelectedItems: (item: any) => void;
}

function ItemList({ addToSelectedItems }: ItemListProps): JSX.Element {
  return (
    <div className="item-list">
      <h2>Available Items</h2>
      {items.map((item) => (
        <Item key={item.item_id} item={item} addToSelectedItems={addToSelectedItems} />
      ))}
    </div>
  );
}

export default ItemList;
