// components/Item.tsx
import React, { useState } from 'react';

interface ItemProps {
  item: { item_id: number; item_name: string };
  addToSelectedItems: (item: any) => void;
}

function Item({ item, addToSelectedItems }: ItemProps): JSX.Element {
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToList = () => {
    const selectedItem = { ...item, quantity };
    addToSelectedItems(selectedItem);
  };

  return (
    <div className="item">
      <p>{item.item_name}</p>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <button onClick={handleAddToList}>Add to List</button>
    </div>
  );
}

export default Item;
