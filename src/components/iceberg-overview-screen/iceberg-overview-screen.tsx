import classNames from 'classnames';
import styles from './iceberg-overview-screen.module.scss';

import { IceBergData, IceBergOverview } from './iceberg-data';
import React, { useRef } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { arrayMove } from '@dnd-kit/helpers';

import { CardTray, IceBergSlot } from './column';
import { DragCard } from './item';
import { observer } from 'mobx-react-lite';
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
            <Content />
        </div>
    );
};

function clone(value: IceBergData): IceBergData {
    return { slots: { ...value.slots }, tray: [...value.tray] };
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


function Content() {
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
            <div style={{
                display: "grid",
                gridTemplate: "1fr / 1fr 1fr",
                gap: 20,
            }}>

                <div>
                    <IceBergObservable items={items} />
                </div>

                <CardTray key={'tray'} slots={6}>
                    <TrayItemObservable items={items} />
                </CardTray>


            </div>

        </DragDropProvider >
    );
}