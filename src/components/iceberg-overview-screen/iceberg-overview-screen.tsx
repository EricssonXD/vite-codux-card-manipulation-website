import classNames from 'classnames';
import styles from './iceberg-overview-screen.module.scss';

import NextDnd from './next-dnd';

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
            <NextDnd />
        </div>
    );
};
