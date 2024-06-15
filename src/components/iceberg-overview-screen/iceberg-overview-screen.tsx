import classNames from 'classnames';
import styles from './iceberg-overview-screen.module.scss';
import { IceBerg } from '../ice-berg/ice-berg';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';


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
        </div>
    );
};

function AAA() {
    const containers = ['A', 'B', 'C'];
    const cardTrayContainers = ['1', '2', '3', '4', '5'];
    const draggables = ['1', '2', '3'];
    const [parent, setParent] = useState(null);
    // disallow highlighting of the text when dragging
    const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className={styles.grid}>
                <div>{containers.map((id) => (
                    // We updated the Droppable component so it would accept an `id`
                    // prop and pass it to `useDroppable`
                    <Droppable key={id} id={id}>
                        {parent === id ? draggableMarkup : 'Drop here'}
                    </Droppable>
                ))}</div>

                <div>{cardTrayContainers.map((id) => (
                    // We updated the Droppable component so it would accept an `id`
                    // prop and pass it to `useDroppable`
                    <Droppable key={"T" + id} id={"T" + id}>
                        {parent === "T" + id ? draggableMarkup : 'Drop here'}
                    </Droppable>
                ))}</div>

                {draggableMarkup}
            </div>
        </DndContext>
    );

    function handleDragEnd(event: any) {
        const { over } = event;

        // If the item is dropped over a container, set it as the parent
        // otherwise reset the parent to `null`
        setParent(over ? over.id : null);
    }
}

function Droppable(props: any) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}

function Draggable(props: any) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });
    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </div>
    );
}
