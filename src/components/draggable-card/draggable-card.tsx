import classNames from 'classnames';
import styles from './draggable-card.module.scss';
import PlaceholderJpg from '../../assets/card-images/placeholder.jpg';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UniqueIdentifier } from '@dnd-kit/core';

export interface DraggableCardProps {
    className?: string;
    imageText?: string;
    imageSrc?: string;
    id: UniqueIdentifier;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DraggableCard = ({ className, imageText, imageSrc, id }: DraggableCardProps) => {

    return (
        <div className={classNames(styles.root, className)}>
            <img draggable="false" src={imageSrc ? imageSrc : PlaceholderJpg} className={styles.cardImg} />
            <div className={styles.centeredCardText}>{imageText}</div>
        </div>
    );
};
