import { createBoard } from '@wixc3/react-board';
import { Draggable } from '../../../components/draggable/draggable';

export default createBoard({
    name: 'Draggable',
    Board: () => <Draggable />,
    isSnippet: true,
});
