/* eslint-disable @next/next/no-img-element */
// eslint-disable-next-line @next/next/no-img-element

import { memo } from "react";
import type { FC } from "react";

import resets from "../styled/_resets.module.css";
import { IconCopy } from "./IconCopy/IconCopy";
import { LogoIcon } from "./LogoIcon";
import classes from "./ModalMobileQR.module.css";
import { VectorIcon2 } from "./VectorIcon2";
import { VectorIcon3 } from "./VectorIcon3";

interface Props {
  className?: string;
  qr: string;
  id: string;
  onClose: () => Promise<void> | unknown;
}
/* @figmaId 12:271 */
export const ModalMobileQR: FC<Props> = memo(function ModalMobileQR(
  props = { qr: "", id: "", onClose: () => Promise<void> }
) {
  return (
    <>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div
                  id={props.id}
                  className={`${resets.storybrainResets} ${classes.root}`}
                >
                  <div className={classes.top}>
                    <div className={classes.logo}>
                      {/* <LogoIcon className={classes.icon4} /> */}
                    </div>
                  </div>
                  <div className={classes.title}>
                    <div className={classes.container}>
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
                  </div>
                </div>
                <button
                  data-modal-target="defaultModal"
                  data-modal-toggle="defaultModal"
                  className="w-full block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                  onClick={async () => {
                    await props.onClose();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
