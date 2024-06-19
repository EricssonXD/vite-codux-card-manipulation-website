
import { makeAutoObservable } from "mobx"
import { makePersistable, stopPersisting } from 'mobx-persist-store';

export type IceBergData = {
    slots: { [key: string]: string | null; },
    tray: string[]
};



export class IceBergOverview {

    static clone(value: IceBergData): IceBergData {
        return { slots: { ...value.slots }, tray: [...value.tray] };
    }

    value: IceBergData;

    constructor(value: IceBergData) {
        makeAutoObservable(this);
        this.value = value;
        stopPersisting(this);
        // makePersistable(this, { name: 'IceBergOverview', properties: ["value"], storage: window.localStorage }, { delay: 1000 });
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