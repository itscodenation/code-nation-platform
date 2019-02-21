import {useImmer} from 'use-immer';

export default function useCollection() {
  const [collection, updateCollection] = useImmer({
    items: [],
    isComplete: false,
  });

  function addItems(items, isComplete = false) {
    updateCollection((draft) => {
      draft.items.splice(draft.length, 0, ...items);
      draft.isComplete = isComplete;
    });
  }

  function reset() {
    updateCollection((draft) => {
      draft.items = [];
      draft.isComplete = false;
    });
  }

  return [
    collection,
    addItems,
    reset,
  ];
}
