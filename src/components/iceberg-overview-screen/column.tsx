import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority, UniqueIdentifier } from '@dnd-kit/abstract';

export function CardTray({ children, slots }: { children: any; slots: number }) {

    const gap = 8;
    const columns = 3;
    const rows = 2;

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, max-content)',
        gap: gap,
    };

    const containerStyle = {
        backgroundColor: 'black',
        width: 100 * columns + gap * (columns - 1) + 16,
        height: 100 * rows + gap * (rows - 1) + 16,
        justifyContent: 'center', // Centers child elements horizontally in the container
        alignItems: 'center', // Centers child elements vertically in the container
        display: 'flex', // Enables flex context for the container
    }

    const outerStyle = {
        display: "grid",
        gridtemplate: "1fr / 1fr",
        placeitems: "center",
    }

    const topStyle = {
        ...gridStyle,
        gridColumn: "1/1",
        gridRow: "1/1",
        zindex: 1,
    }

    const botStyle = {
        ...gridStyle,
        gridColumn: "1/1",
        gridRow: "1/1",
        zindex: 0,
    }

    return (

        <div style={containerStyle}>
            <div style={outerStyle}>
                {/* Childrens which is the items I will put inside */}
                <div style={topStyle}>
                    {children}
                </div>
                {/* CardTraySlots at the bottom of each children*/}
                <div className="CardTray" style={botStyle}>
                    {Array.from({ length: slots }).map((_, index) => (
                        <CardTraySlot id={index} key={index} />
                    ))}
                </div>
            </div>


        </div>
    );
}


export function CardTraySlot({ children, id }: { children?: any; id: UniqueIdentifier }) {
    const { ref } = useDroppable({
        id,
        type: 'CardTraySlot',
        accept: 'item',
        collisionPriority: CollisionPriority.Highest,
    });

    return (
        <div className="CardTraySlot" ref={ref} style={{ width: 100, minHeight: 100, maxHeight: 100, opacity: 1, backgroundColor: "red" }}>
            {children}
        </div>
    );
}

export function IceBergSlot({ children, id }: { children: any; id: UniqueIdentifier }) {
    const { ref } = useDroppable({
        id,
        type: 'IceBergSlot',
        accept: 'item',
        collisionPriority: CollisionPriority.Highest,
    });

    return (
        <div className="IceBergSlot" ref={ref} style={{ width: 100, minHeight: 100, maxHeight: 100, backgroundColor: 'rgba(128, 128, 128, 0.3)' }}>
            {children}
        </div>
    );
}