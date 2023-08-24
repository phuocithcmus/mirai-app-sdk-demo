import { memo, SVGProps } from 'react';

const VectorIcon2 = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 13 13' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M12.0137 4.00614V2.00453C12.0137 1.47368 11.8028 0.96456 11.4274 0.589186C11.052 0.213812 10.5429 0.00292969 10.012 0.00292969H2.00553C1.47467 0.00292969 0.965547 0.213812 0.590169 0.589186C0.214791 0.96456 0.00390625 1.47368 0.00390625 2.00453V10.011C0.00390625 10.5418 0.214791 11.0509 0.590169 11.4263C0.965547 11.8017 1.47467 12.0126 2.00553 12.0126H4.00716'
      stroke='#5094F7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
const Memo = memo(VectorIcon2);
export { Memo as VectorIcon2 };
