import React from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import { UniqueIdentifier } from '@dnd-kit/core';
import { DraggableCard } from '../draggable-card/draggable-card';
import { shapeIntersection } from '@dnd-kit/collision';


export function Item({ id, index, column }: { id: UniqueIdentifier; index: number; column: string }) {
    const { ref } = useSortable({
        id,
        index,
        type: 'item',
        accept: 'item',
        group: column,
        collisionDetector: shapeIntersection,
    });

    const style = {
        width: 100,
        height: 100,
    };

    return (
        <div ref={ref} style={style}>
            <DraggableCard id={id} imageText={id.toString()} />
        </div>

    );
}
