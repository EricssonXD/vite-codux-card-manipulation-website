import type { FC } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DraggableCard } from '../draggable-card/draggable-card';

export const Item: FC<{
  id: UniqueIdentifier;
  isDragging?: boolean;
  isOverlay?: boolean;
}> = ({ id, isDragging = false, isOverlay = false }) => {
  if (isDragging) {
    return (
      <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(128, 128, 128, 0.3)' }}></div>
    )
  }


  return (
    <DraggableCard id={id} imageText={id.toString()} />
  );
};

const SortableItem: FC<{ id: UniqueIdentifier }> = ({ id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    // Use Translate instead of Transform if overlay is disabled
    transform: CSS.Translate.toString(transform),
    width: '100px',
    height: '100px',
    // transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item id={id} isDragging={isDragging} />
    </div>
  );
};

export default SortableItem;
