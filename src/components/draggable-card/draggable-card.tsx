import classNames from 'classnames';
import styles from './draggable-card.module.scss';
import PlaceholderJpg from '../../assets/card-images/placeholder.jpg';

export interface DraggableCardProps {
    className?: string;
    imageText?: string;
    imageSrc?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DraggableCard = ({ className, imageText, imageSrc }: DraggableCardProps) => {

    return (
        <div className={classNames(styles.root, className)}>
            <img draggable="false" src={imageSrc ? imageSrc : PlaceholderJpg} className={styles.cardImg} />
            <div className={styles.centeredCardText}>{imageText}</div>
        </div>
    );
};
