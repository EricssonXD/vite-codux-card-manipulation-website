import React from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import { RestrictToWindow } from '@dnd-kit/dom/modifiers';
import { DraggableCard } from '../draggable-card/draggable-card';
import { shapeIntersection } from '@dnd-kit/collision';
import { UniqueIdentifier } from '@dnd-kit/abstract';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/react';



export function DragCard({ id }: { id: UniqueIdentifier; }) {
    const { ref, isDragSource } = useDraggable({
        id,
        type: 'item',
        modifiers: [RestrictToWindow],
    });

    const style = {
        width: 100,
        height: 100,
        opacity: isDragSource ? 0.5 : 1,
    };

    return (
        <motion.div ref={ref} style={style}
            layoutId={String(id)}
            animate={
                {
                    scale: isDragSource ? 1.05 : 1,
                    zIndex: isDragSource ? 1 : 0,
                    boxShadow: isDragSource
                        ? '0 0 0 1px rgba(63, 63, 68, 0.05), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)'
                        : undefined,
                    // rotateZ: isDragSource ? 10 : 0,
                }

            }
            transition={{
                duration: !isDragSource ? 0.25 : 0,
                easings: {
                    type: 'spring',
                },
                scale: {
                    duration: 0.25,
                },
                zIndex: {
                    delay: isDragSource ? 0 : 0.25,
                },
            }}>
            <DraggableCard id={id} imageText={id.toString()} />
        </motion.div>

    );
}

