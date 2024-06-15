import { createBoard } from '@wixc3/react-board';
import { IcebergOverviewScreen } from '../../../components/iceberg-overview-screen/iceberg-overview-screen';
import IcebergOverviewScreen_module from '../../../components/iceberg-overview-screen/iceberg-overview-screen.module.scss';

export default createBoard({
    name: 'IcebergOverviewScreen',
    Board: () => <IcebergOverviewScreen />,
    isSnippet: true,
    environmentProps: {
        windowWidth: 1052,
        canvasWidth: 592,
    },
});
