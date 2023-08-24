import { memo, SVGProps } from 'react';

const VectorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 13 13' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M10.016 0.0078125H2.00944C0.903972 0.0078125 0.0078125 0.903961 0.0078125 2.00942V10.0158C0.0078125 11.1213 0.903972 12.0174 2.00944 12.0174H10.016C11.1214 12.0174 12.0176 11.1213 12.0176 10.0158V2.00942C12.0176 0.903961 11.1214 0.0078125 10.016 0.0078125Z'
      stroke='#5094F7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
const Memo = memo(VectorIcon);
export { Memo as VectorIcon };
