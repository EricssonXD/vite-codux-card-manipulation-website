import React, { useRef } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { arrayMove } from '@dnd-kit/helpers';

import { CardTray, IceBergSlot } from './column';
import { DragCard } from './item';
import IcebergOverviewScreen_module from './iceberg-overview-screen.module.scss';
import classes from './next-dnd.module.scss';

// The example is from the official documentation
// https://next.dndkit.com/react/guides/multiple-sortable-lists

import { makeAutoObservable } from "mobx"
import { makePersistable, stopPersisting } from 'mobx-persist-store';
import { observer } from 'mobx-react-lite';


type IceBergData = {
    slots: { [key: string]: string | null; },
    tray: string[]
};

function clone(value: IceBergData): IceBergData {
    return { slots: { ...value.slots }, tray: [...value.tray] };
}

class IceBergOverview {
    value: IceBergData;

    constructor(value: IceBergData) {
        makeAutoObservable(this);
        this.value = value;
        // stopPersisting(this);
        // makePersistable(this, { name: 'IceBergOverview', properties: ["value"], storage: window.localStorage });
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

    find(value: string): { key: string, index?: number } | undefined {

        let foundKey: string | undefined;
        Object.entries(this.value.slots).find(([key, id]) => { if (id === value) { foundKey = key; return true } return false; });
        if (foundKey) return { key: foundKey };

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

    const previousSlots = useRef<IceBergData>(clone(items.value));
    const initialDragData = useRef<{ key: string, index?: number } | null>();
    const requireReset = useRef(false);

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
            onBeforeDragStart={(event) => {
            }}
            onDragStart={(event) => {
                console.log('Drag Start')
                previousSlots.current = clone(items.value);
                if (event.operation.source) {
                    initialDragData.current = items.find(event.operation.source.id.toString());
                }
            }}

            onDragOver={(event) => {
                const { source, target } = event.operation;
                if (!source || !target) return;

                const sourceItem = source.id.toString();

                const sourceKey = initialDragData.current!.key;
                const sourceIndex = initialDragData.current!.index;
                items.set((prev) => {
                    prev = clone(previousSlots.current);
                    // Move to iceberg slot
                    if (target?.type === 'IceBergSlot') {
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
                            const targetItem = prev.slots[targetSlot];

                            // Swap
                            prev.slots[targetSlot] = sourceItem; // Set the target slot to the source item
                            if (sourceKey === 'tray') {
                                prev.tray[sourceIndex!] = targetItem;
                            } else {
                                prev.slots[sourceKey] = targetItem;
                            }
                        }
                        return prev;
                    }

                    // Move to card tray
                    if (target?.type === 'CardTraySlot') {
                        let tSourceIndex = sourceIndex!;
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
                    }

                    return prev;
                });
                requireReset.current = true;
            }}
            onDragMove={(event) => {
                const sourceItem = event.operation.source?.id.toString();
                const targetSlot = event.operation.target?.id.toString();
                if (!sourceItem) return;

                // Reset if not hovering over a valid target
                if (!targetSlot && requireReset.current) {
                    items.set(previousSlots.current!);
                    requireReset.current = false;
                }
            }}
            onDragEnd={(event) => {
                const { source, target } = event.operation;
                initialDragData.current = null;

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
