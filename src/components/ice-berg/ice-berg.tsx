import classNames from 'classnames';
import styles from './ice-berg.module.scss';

export interface IceBergProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */

export const IceBerg = ({ className }: IceBergProps) => {
    return (
        <div className={classNames(styles.root, className)}>

        </div>
    );
};
