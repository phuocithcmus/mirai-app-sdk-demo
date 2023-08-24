import { memo, SVGProps } from 'react';

const ButtonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect width={28} height={28} rx={14} fill='white' />
    <path
      d='M19 10.0071L17.9929 9L14 12.9929L10.0071 9L9 10.0071L12.9929 14L9 17.9929L10.0071 19L14 15.0071L17.9929 19L19 17.9929L15.0071 14L19 10.0071Z'
      fill='#141414'
    />
  </svg>
);
const Memo = memo(ButtonIcon);
export { Memo as ButtonIcon };
