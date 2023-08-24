import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../styled/_resets.module.css';
import classes from './IconCopy.module.css';
import { VectorIcon2 } from './VectorIcon2';
import { VectorIcon } from './VectorIcon';

interface Props {
    className?: string;
    classes?: {
        vector?: string;
        root?: string;
    };
    swap?: {
        vector?: ReactNode;
        vector2?: ReactNode;
    };
}
/* @figmaId 12:133 */
export const IconCopy: FC<Props> = memo(function IconCopy(props = {}) {
    return (
        <div
            className={`${resets.storybrainResets} ${props.classes?.root || ''} ${props.className || ''} ${
                classes.root
            }`}
        >
            <div className={classes.vector2}>{props.swap?.vector || <VectorIcon className={classes.icon} />}</div>
            <div className={classes.vector3}>{props.swap?.vector2 || <VectorIcon2 className={classes.icon2} />}</div>
        </div>
    );
});
