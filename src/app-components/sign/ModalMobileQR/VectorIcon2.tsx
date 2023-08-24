import { memo, SVGProps } from 'react';

const VectorIcon2 = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 13 13' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M10.0013 0.00130081H2.0013C0.896731 0.00130081 0.00130081 0.896721 0.00130081 2.00128V10.0012C0.00130081 11.1057 0.896731 12.0012 2.0013 12.0012H10.0013C11.1059 12.0012 12.0013 11.1057 12.0013 10.0012V2.00128C12.0013 0.896721 11.1059 0.00130081 10.0013 0.00130081Z'
      stroke='#5094F7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
const Memo = memo(VectorIcon2);
export { Memo as VectorIcon2 };
