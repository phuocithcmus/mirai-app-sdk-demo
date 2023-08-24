import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../styled/_resets.module.css';
import classes from './IconChevronleft.module.css';
import { VectorIcon } from './VectorIcon';

interface Props {
    className?: string;
    classes?: {
        vector?: string;
        root?: string;
    };
    swap?: {
        vector?: ReactNode;
    };
}
/* @figmaId 12:132 */
export const IconChevronleft: FC<Props> = memo(function IconChevronleft(props = {}) {
    return (
        <div
            className={`${resets.storybrainResets} ${props.classes?.root || ''} ${props.className || ''} ${
                classes.root
            }`}
        >
            <div className={classes.vector2}>{props.swap?.vector || <VectorIcon className={classes.icon} />}</div>
        </div>
    );
});
