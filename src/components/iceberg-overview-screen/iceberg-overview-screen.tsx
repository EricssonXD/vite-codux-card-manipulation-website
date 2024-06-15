import classNames from 'classnames';
import styles from './iceberg-overview-screen.module.scss';
import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    DragOverEvent,
    rectIntersection,
    closestCorners,
    CollisionDetection,
    Collision,
    Active,
    DroppableContainer,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableCard } from '../draggable-card/draggable-card';
import { Container, Header } from 'semantic-ui-react';
import { RectMap } from '@dnd-kit/core/dist/store';
import TestTemplate from './TestTemplate';

export interface IcebergOverviewScreenProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const IcebergOverviewScreen = ({ className }: IcebergOverviewScreenProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            <TestTemplate />
        </div>
    );
};

function Complete() {
    const [cardTray, setCardTray] = useState([1, 2, 3, 4, 5]);
    const [icebergSlots, setIcebergSlots] = useState<number[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );



    const { setNodeRef: actionSlotRef } = useDroppable({
        id: 'actionSlot',
        data: { type: 'iceBerg' },
    });
    const { setNodeRef: emotionSlotRef } = useDroppable({
        id: 'emotionSlot',
        data: { type: 'iceBerg' },
    });

    return (
        <TestTemplate />
    )


    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {

            setCardTray((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });

        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over, collisions } = event;


        if (!over) return;
        if (over.data.current) {
            console.log(over.data.current.type);
        } else {
            console.log("Nothing");
        }
        if (over.data.current ? over.data.current.type === 'iceBerg' : false) {
            console.log('over iceberg');
        }

    }


}

function DropSlot() {
    return (
        <div>
            <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(128, 128, 128, 0.3)' }}></div>
        </div>
    );
}



function customCollisionDetectionAlgorithm(args: any): Collision[] {
    const targetContainers: DroppableContainer[] = args.droppableContainers;
    const droppableRects: RectMap = args.droppableRects;


    const icebergCollision = rectIntersection({
        ...args,
        droppableRects: droppableRects,
        droppableContainers: targetContainers.filter((container: DroppableContainer) => (container.data.current ? container.data.current.type === 'iceBerg' : false))
    });

    if (icebergCollision.length > 0) {
        // The trash is intersecting, return early
        console.log('iceberg collision');
        return icebergCollision;
    }

    // console.log(targetContainers);
    // for (let container of targetContainers) {
    //     console.log(container.data.current!.type);
    // }



    // First, let's see if the `trash` droppable rect is intersecting
    const rectIntersectionCollisions = rectIntersection({
        ...args,
        droppableContainers: targetContainers.filter(({ id }) => id === 'trash')
    });

    // Collision detection algorithms return an array of collisions
    if (rectIntersectionCollisions.length > 0) {
        // The trash is intersecting, return early
        return rectIntersectionCollisions;
    }

    // Compute other collisions
    return closestCorners({
        ...args,
        droppableContainers: targetContainers.filter(({ id }) => id !== 'trash')
    });
};