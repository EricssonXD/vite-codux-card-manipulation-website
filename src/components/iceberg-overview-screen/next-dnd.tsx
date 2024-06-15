import React, { useRef, useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { arrayMove, move, swap } from '@dnd-kit/helpers';

import { Column, IceBergSlot } from './column';
import { Item } from './item';
import IcebergOverviewScreen_module from './iceberg-overview-screen.module.scss';
import classes from './next-dnd.module.scss';

// The example is from the official documentation
// https://next.dndkit.com/react/guides/multiple-sortable-lists

export function NextDnd() {
    const [items, setItems] = useState<{
        [key: string]: string[];
    }>({
        CardTray: ['A0', 'A1', 'A2'],
        Emotion: ['B0'],
    });
    const previousItems = useRef(items);

    return (
        <DragDropProvider
            onDragStart={() => {
                previousItems.current = items;
            }}
            onDragOver={(event) => {
                const { source, target } = event.operation;

                if (source?.type === 'column') return;


                if (source?.type === 'item' && target?.type === 'iceberg') {
                    const targetId = target.id.toString();
                    const slot = items[targetId];


                    console.log('onDragOver', slot);

                    if (slot.length > 0) {
                        const currentItem = slot[0];

                        setItems((items) => { return move(items, source, target); });
                        setItems((items) => {

                            return ({
                                ...items,
                                [targetId]: items[targetId].filter((id) => id !== currentItem),
                                CardTray: [...items.CardTray, currentItem],
                            })
                        });
                        // setItems((items) => { return move(items, target, source ); });
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

                setItems((items) => { return move(items, source, target); });

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
                        setItems(previousItems.current);
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
                    {items.Emotion.map((id, index) => (
                        <Item key={id} id={id} index={index} column={'Emotion'} />
                    ))}
                </IceBergSlot>

                <Column key={'CardTray'} id={'CardTray'}>
                    {items.CardTray.map((id, index) => (
                        <Item key={id} id={id} index={index} column={'CardTray'} />
                    ))}
                </Column>


            </div>

        </DragDropProvider>
    );
}

export default NextDnd;


