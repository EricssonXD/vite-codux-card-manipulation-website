import { createBoard } from '@wixc3/react-board';
import { IceBerg } from '../../../components/ice-berg/ice-berg';

export default createBoard({
    name: 'IceBerg',
    Board: () => <IceBerg />,
    isSnippet: true,
});
