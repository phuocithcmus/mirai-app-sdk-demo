/* eslint-disable @next/next/no-img-element */
// eslint-disable-next-line @next/next/no-img-element

import { memo } from 'react';
import type { FC } from 'react';

import resets from '../styled/_resets.module.css';
import { IconCopy } from './IconCopy/IconCopy';
import { LogoIcon } from './LogoIcon';
import classes from './ModalMobileQR.module.css';
import { VectorIcon2 } from './VectorIcon2';
import { VectorIcon3 } from './VectorIcon3';
import { Notice } from '../Notice/Notice';

interface Props {
    className?: string;
    qr: string;
    id: string;
}
/* @figmaId 12:271 */
export const ModalMobileQR: FC<Props> = memo(function ModalMobileQR(props = { qr: '', id: '' }) {
    return (
        <div id={props.id} className={`${resets.storybrainResets} ${classes.root}`}>
            <div className={classes.top}>
                <div className={classes.logo}>
                    <LogoIcon className={classes.icon4} />
                </div>
                {/* <div className={classes.button}>
                    <ButtonIcon className={classes.icon5} />
                </div> */}
            </div>
            <div className={classes.title}>
                <div className={classes.container}>
                    {/* <IconChevronleft
                        className={classes.iconChevronleft}
                        classes={{ vector: classes.vector }}
                        swap={{
                            vector: <VectorIcon className={classes.icon} />,
                        }}
                    /> */}
                    <div className={classes.scanTheCode}>Scan the code</div>
                    <IconCopy
                        className={classes.iconCopy}
                        classes={{ vector: classes.vector2 }}
                        swap={{
                            vector: <VectorIcon2 className={classes.icon2} />,
                            vector2: <VectorIcon3 className={classes.icon3} />,
                        }}
                    />
                </div>
                <div className={classes.image1}>
                    <img alt="" src={props.qr} />
                </div>
                <p
                    style={{
                        wordBreak: 'break-word',
                    }}
                >
                    <strong>
                        <span style={{ color: 'red', marginLeft: '12px' }}>* </span> We supported wallets: Mirai,
                        Metasmask, Trust Wallet
                    </strong>
                </p>
            </div>
        </div>
    );
});
