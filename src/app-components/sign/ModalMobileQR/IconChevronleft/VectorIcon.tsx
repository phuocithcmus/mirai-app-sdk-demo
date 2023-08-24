import { memo, SVGProps } from 'react';

const VectorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 6 10' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M5.49994 -4.1008e-05L0.499938 4.99995L5.49994 9.99995'
      stroke='#5094F7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
const Memo = memo(VectorIcon);
export { Memo as VectorIcon };
