import React, { useRef, useState } from 'react';
import { DragDropProvider, useDragDropManager } from '@dnd-kit/react';
import { arrayMove, arraySwap, move } from '@dnd-kit/helpers';

import { CardTray, CardTraySlot, IceBergSlot } from './column';
import { DragCard } from './item';
import IcebergOverviewScreen_module from './iceberg-overview-screen.module.scss';
import classes from './next-dnd.module.scss';

// The example is from the official documentation
// https://next.dndkit.com/react/guides/multiple-sortable-lists

import { makeAutoObservable } from "mobx"
import { makePersistable } from 'mobx-persist-store';
import { Draggable, Droppable } from '@dnd-kit/abstract';
import { observer } from 'mobx-react-lite';


type IceBergData = {
    slots: { [key: string]: string | null; },
    tray: string[]
};

class IceBergOverview {
    value: IceBergData;

    constructor(value: IceBergData) {
        makeAutoObservable(this);
        this.value = value;

        // makePersistable(this, { name: 'bergSlot', properties: ["value"], storage: window.localStorage });
    }

    set(valueOrFn: IceBergData | ((value: IceBergData) => IceBergData)) {
        if (typeof valueOrFn === 'function') {
            const { tray, slots } = valueOrFn({ tray: this.value.tray, slots: this.value.slots });
            this.value.tray = tray;
            this.value.slots = slots;
        } else {
            this.value.slots = valueOrFn.slots;
            this.value.tray = valueOrFn.tray;
        }
    };


    setTray(valueOrFn: string[] | ((value: string[]) => string[])) {
        if (typeof valueOrFn === 'function') {
            this.value.tray = valueOrFn(this.value.tray);
        } else {
            this.value.tray = valueOrFn;
        }
    };

    setSlots(valueOrFn: { [key: string]: string | null } | ((value: { [key: string]: string | null }) => { [key: string]: string | null })) {
        if (typeof valueOrFn === 'function') {
            this.value.slots = valueOrFn(this.value.slots);
        } else {
            this.value.slots = valueOrFn;
        }
    };

    find(value: string): { key: string, index: number } | undefined {

        let foundKey: string | undefined;
        Object.entries(this.value.slots).find(([key, id]) => { if (id === value) { foundKey = key; return true } return false; });
        if (foundKey) return { key: foundKey, index: 0 };

        const index = this.value.tray.indexOf(value);
        if (index !== -1) return { key: 'tray', index: index };
    }
}

//Create a fixed sized list
const items = new IceBergOverview({
    tray: ['A0', 'A1', 'A2', 'A3', 'A4'],
    slots: {
        Action: null,
        Emotion: null,
        Expectation: null,
        Belief: null,
        SelfWorth: null,
    }
});


export function NextDnd() {

    const previousSlots = useRef(items.value);
    const dragging = useRef(false);
    const [swappingCard, setSwappingCard] = useState<{ swapped: boolean, cardId: string | undefined }>({ swapped: false, cardId: undefined });

    const manager = useDragDropManager();

    const IceBergObservable = observer(({ items }: { items: IceBergOverview }) => <>{
        Object.entries(items.value.slots).map(([key, id]) => (
            <IceBergSlot key={key} id={key.toString()} >
                {id ? <DragCard key={id} id={id} /> : null}
            </IceBergSlot>
        ))
    }</>)

    const TrayItemObservable = observer(({ items }: { items: IceBergOverview }) => <>{
        items.value.tray.map((id) => (
            <DragCard key={id} id={id} />
        ))
    }</>)


    return (
        <DragDropProvider
            manager={manager}
            onDragStart={() => {
                previousSlots.current = items.value;
                dragging.current = true;
            }}

            onDragOver={(event) => {
                const { source, target } = event.operation;
                if (!source || !target) return;
                const sourceItem = source.id.toString();

                const foundItem = items.find(sourceItem);
                if (!foundItem) return; // Return if the item does not exists
                const sourceKey = foundItem.key;
                const sourceIndex = foundItem.index;

                // if (source?.type === 'item' && target?.type === 'iceberg') {
                //     const targetId = target.id.toString();
                //     const slot = items.slots[targetId];


                //     // console.log('onDragOver', slot);

                //     if (slot) {
                //         const targetCard = manager.registry.draggables.get(slot[0]) as Draggable;
                //         const sourceCard = manager.registry.droppables.get(source.id) as Droppable;

                //         setSwappingCard(({ cardId: slot[0], swapped: true }));
                //         items.set((item) => move(move(item, targetCard, sourceCard), source, target));

                //         return;
                //     }

                // } else {
                //     setSwappingCard((prev) => ({ ...prev, swapped: false }));
                // }

                // Move to iceberg slot
                if (target?.type === 'IceBergSlot') {
                    items.set((prev) => {
                        const targetSlot = target.id;

                        // Check if slot is empty
                        if (prev.slots[targetSlot] === null) {
                            prev.slots[targetSlot] = sourceItem;
                            if (sourceKey === 'tray') {
                                prev.tray = prev.tray.filter((id) => id !== sourceItem);
                            } else {
                                prev.slots[sourceKey] = null;
                            }
                        } else {
                            // Swap
                            const targetItem = prev.slots[targetSlot];
                            prev.slots[targetSlot] = sourceItem;
                            if (sourceKey === 'tray') {
                                prev.tray[sourceIndex] = targetItem;
                            } else {
                                prev.slots[sourceKey] = targetItem;
                            }
                        }

                        return prev;
                    });
                }

                // Move to card tray
                if (target?.type === 'CardTraySlot') {
                    items.set((prev) => {
                        let tSourceIndex = sourceIndex;
                        const targetIndex: number = Number(target.id)

                        // If the source is not from the tray
                        if (sourceKey !== 'tray') {
                            tSourceIndex = prev.tray.length;
                            prev.tray.push(sourceItem)
                            prev.slots[sourceKey] = null;
                        }

                        return {
                            tray: arrayMove(prev.tray, tSourceIndex, targetIndex),
                            slots: prev.slots
                        };
                    });
                }
            }}
            // onDragMove={(event) => {
            //     if (!swappingCard.swapped && swappingCard.cardId) {
            //         const source = event.operation.source?.id.toString();
            //         if (source) {
            //             items.set((prev) => {

            //                 var targetSlot: string | undefined = undefined;

            //                 Object.entries(prev).map(([key, value]) => {
            //                     if (value.includes(source)) {
            //                         targetSlot = key;
            //                     }
            //                 });

            //                 if (!targetSlot) return prev; //If the source is not in any slot, return

            //                 const targetCard = manager.registry.droppables.get(swappingCard.cardId!) as Droppable;
            //                 const draggableTargetCard = manager.registry.draggables.get(swappingCard.cardId!) as Draggable;
            //                 const slot = manager.registry.droppables.get(targetSlot) as Droppable;
            //                 const sourceCard = manager.registry.draggables.get(source) as Draggable;

            //                 return move(move(prev, sourceCard, targetCard), draggableTargetCard, slot);


            //             });
            //         }
            //         setSwappingCard({ swapped: false, cardId: undefined });
            //     }

            // }}
            onDragEnd={(event) => {
                const { source, target } = event.operation;
                dragging.current = false;

                if (event.canceled) {
                    if (source && source.type === 'item') {
                        items.set(previousSlots.current);
                    }
                    return;
                }

            }}
        >
            <div className={classes.grid}>

                <div>
                    <IceBergObservable items={items} />
                </div>

                <CardTray key={'tray'} slots={6}>
                    <TrayItemObservable items={items} />
                </CardTray>


            </div>

        </DragDropProvider>
    );
}

export default NextDnd;
