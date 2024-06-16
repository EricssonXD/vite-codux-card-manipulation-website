import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority, UniqueIdentifier } from '@dnd-kit/abstract';

export function Column({ children, id }: { children: any; id: UniqueIdentifier }) {
    const { ref } = useDroppable({
        id,
        type: 'CardTray',
        accept: 'item',
        collisionPriority: CollisionPriority.Low,
    });

    return (
        <div className="CardTray" ref={ref}>
            {children}
        </div>
    );
}


export function IceBergSlot({ children, id }: { children: any; id: UniqueIdentifier }) {
    const { ref } = useDroppable({
        id,
        type: 'iceberg',
        accept: 'item',
        collisionPriority: CollisionPriority.Highest,
    });

    return (
        <div className="IceBergSlot" ref={ref} style={{ width: 100, minHeight: 100, maxHeight: 100, backgroundColor: 'rgba(128, 128, 128, 0.3)' }}>
            {children}
        </div>
    );
}