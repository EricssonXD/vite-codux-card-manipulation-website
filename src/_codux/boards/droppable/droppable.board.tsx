import { createBoard } from '@wixc3/react-board';
import { Droppable } from '../../../components/droppable/droppable';

export default createBoard({
    name: 'Droppable',
    Board: () => <Droppable />,
    isSnippet: true,
});
