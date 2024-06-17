import React, { useRef, useState } from 'react';
import { DragDropProvider, useDragDropManager } from '@dnd-kit/react';
import { arrayMove, move, swap } from '@dnd-kit/helpers';

import { Column, IceBergSlot } from './column';
import { Item } from './item';
import IcebergOverviewScreen_module from './iceberg-overview-screen.module.scss';
import classes from './next-dnd.module.scss';
import { DragDropManager, Draggable, Droppable } from '@dnd-kit/dom';
import useMousePosition from './useMousePosition';

// The example is from the official documentation
// https://next.dndkit.com/react/guides/multiple-sortable-lists

import { makeObservable, observable, computed, action, flow } from "mobx"
import { makePersistable } from 'mobx-persist-store';

class IceBergOverview {
    value: {
        [key: string]: string[];
    } = {
            CardTray: ['A0', 'A1', 'A2'],
            Emotion: ['B0'],
        };

    constructor(value: {
        CardTray: string[];
        Emotion: string[];
    }) {
        makeObservable(this, {
            value: observable,
            set: action,
            fetch: flow
        })
        this.value = value

        makePersistable(this, { name: 'bergSlot', properties: ["value"], storage: window.localStorage });

    }

    set(value: {
        [key: string]: string[];
    }) {
        this.value = value
    }



    *fetch(): Generator<any, any, any> {
        const response = yield fetch("/api/value")
        this.value = response.json()
    }
}

const items = new IceBergOverview({
    CardTray: ['A0', 'A1', 'A2'],
    Emotion: ['B0'],
});


export function NextDnd() {

    const previousItems = useRef(items.value);
    const [mouseCord, setMouse] = useState({ x: 0, y: 0 });
    const mousePosition = useMousePosition();

    const manager = useDragDropManager();

    return (
        <DragDropProvider
            manager={manager}
            onDragStart={() => {
                previousItems.current = items.value;
                setMouse({ x: mousePosition.x, y: mousePosition.y });
            }}
            onDragOver={(event) => {
                const { source, target } = event.operation;

                if (source?.type === 'column') return;


                if (source?.type === 'item' && target?.type === 'iceberg') {
                    const targetId = target.id.toString();
                    const slot = items.value[targetId];


                    // console.log('onDragOver', slot);


                    if (slot.length > 0) {
                        const currentItem = slot[0];
                        const targetCard = manager.registry.draggables.get(currentItem) as Draggable;
                        const sourceCard = manager.registry.droppables.get(source.id) as Droppable;

                        // manager.actions.setDragSource(targetCard.id)

                        // manager.actions.start({ coordinates: { x: mousePosition.x, y: mousePosition.y }, event: new Event('dragstart') })
                        // manager.actions.move({ to: { x: mouseCord.x, y: mouseCord.y } })
                        // manager.actions.stop()
                        // manager.actions.setDropTarget(sourceCard.id)
                        items.set(move(move(items.value, targetCard, sourceCard), source, target));

                        return;
                    }

                    // setItems((prevItems) => ({
                    //     ...prevItems,
                    //     CardTray: prevItems.CardTray.filter((id) => id !== source.id.toString()),
                    // }));
                    // setItems((items) => {
                    //     return swap(items, source, target);

                    // });
                }

                items.set(move(items.value, source, target));

            }}
            onDragEnd={(event) => {
                const { source, target } = event.operation;
                // if (source?.type === 'item' && target?.type === 'iceberg') {

                //     if (items.CardTray.includes(source.id.toString())) {
                //         console.log('Delete source from card tray');
                //         // Delete source from card tray
                //         setItems((prevItems) => ({
                //             ...prevItems,
                //             CardTray: prevItems.CardTray.filter((id) => id !== source.id.toString()),
                //         }));
                //     }

                //     return;
                // }

                if (event.canceled) {
                    if (source && source.type === 'item') {
                        items.set(previousItems.current);
                    }

                    return;
                }

            }}
        >
            <div className={classes.grid}>

                {/* <IceBergSlot id={'Actions'} key={'Actions'}>
                    {items.Emotion.map((id, index) => (
                        <Item key={id} id={id} index={index} column={'Emotion'} />
                    ))}
                    {/* <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(128, 128, 128, 0.3)' }}></div> */}
                {/* </IceBergSlot> */}

                <IceBergSlot key={'Emotion'} id={'Emotion'} >
                    {items.value.Emotion.map((id, index) => (
                        <Item key={id} id={id} index={index} column={'Emotion'} />
                    ))}
                </IceBergSlot>

                <Column key={'CardTray'} id={'CardTray'}>
                    {items.value.CardTray.map((id, index) => (
                        <Item key={id} id={id} index={index} column={'CardTray'} />
                    ))}
                </Column>


            </div>

        </DragDropProvider>
    );
}

export default NextDnd;
