import { memo, SVGProps } from 'react';

const VectorIcon3 = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M12.0007 3.99963V1.99965C12.0007 1.46922 11.7899 0.960523 11.4149 0.585454C11.0398 0.210386 10.5311 -0.000325203 10.0007 -0.000325203H2.00065C1.47022 -0.000325203 0.961509 0.210386 0.586437 0.585454C0.211364 0.960523 0.000650406 1.46922 0.000650406 1.99965V9.99956C0.000650406 10.53 0.211364 11.0387 0.586437 11.4138C0.961509 11.7888 1.47022 11.9995 2.00065 11.9995H4.00065'
      stroke='#5094F7'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
const Memo = memo(VectorIcon3);
export { Memo as VectorIcon3 };
