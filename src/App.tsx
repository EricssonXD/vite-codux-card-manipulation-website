import styles from './App.module.scss';
import ViteSvg from './assets/vite.svg';
import TypescriptSvg from './assets/typescript.svg';
import { DndContext } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { IcebergOverviewScreen } from './components/iceberg-overview-screen/iceberg-overview-screen';
import { Test } from './components/test/test';
import NextDnd from './components/iceberg-overview-screen/next-dnd';

function App() {
    return (
        <DndContext>
            <NextDnd />

            <div className={styles.App}>
                <h2>Welcome to your App Component 🎉</h2>
                <span>
                    Double click to edit App component
                    <br />
                    &amp; drag here elements from + Add <b>Elements</b> Panel
                </span>
                <p
                    style={{
                        fontSize: '12px',
                        marginTop: '80px',
                        display: 'flex',
                        gap: '3px',
                        justifyContent: 'center',
                    }}
                >
                    This project is using <img src={ViteSvg} width="12" />+
                    <img src={TypescriptSvg} width="12" />
                    Visit vitejs.dev to learn more.
                    <div className={styles.options}>
                        <Test />

                    </div>
                </p>
            </div>
        </DndContext>
    );
}

export default App;
