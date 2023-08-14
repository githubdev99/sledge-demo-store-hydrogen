import {Link} from '..';
import {useTransition} from 'react';

interface IButtonCtaProps extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
  textColor: string;
  position?: 'left' | 'center' | 'right';
  isArrow: boolean;
  color: string;
  className?: string;
  type?: 'button' | 'link';
  link?: string;
  children?: any;
  loading?: any;
  disabledProps?: any;
}

export function Arrow() {
  return (
    <svg
      className="inline ml-[10px]"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8.79429C3 8.50952 3.21162 8.27418 3.48617 8.23693L3.5625 8.23179L13.4505 8.23224L9.87826 4.6746C9.65812 4.4554 9.65735 4.09925 9.87655 3.8791C10.0758 3.67897 10.3883 3.66015 10.6088 3.82306L10.672 3.87739L15.2095 8.39539C15.2386 8.42428 15.2638 8.45555 15.2852 8.48858C15.2912 8.49852 15.2973 8.50869 15.3032 8.51906C15.3085 8.52795 15.3134 8.53718 15.318 8.54652C15.3243 8.5601 15.3305 8.57413 15.3361 8.58845C15.3407 8.59949 15.3445 8.61023 15.348 8.62105C15.3522 8.63447 15.3562 8.64877 15.3597 8.66329C15.3622 8.67343 15.3643 8.68319 15.3661 8.69298C15.3686 8.70755 15.3707 8.72263 15.3722 8.73789C15.3735 8.74953 15.3743 8.76106 15.3747 8.77261C15.3749 8.77961 15.375 8.78693 15.375 8.79429L15.3747 8.81608C15.3743 8.82712 15.3735 8.83815 15.3725 8.84916L15.375 8.79429C15.375 8.82979 15.3717 8.86452 15.3654 8.89819C15.364 8.90623 15.3622 8.91449 15.3603 8.92271C15.3563 8.93964 15.3517 8.95595 15.3464 8.97194C15.3438 8.97988 15.3407 8.98837 15.3375 8.99679C15.3309 9.01371 15.3238 9.02985 15.3159 9.04557C15.3122 9.05296 15.3082 9.06069 15.3039 9.06835C15.2968 9.08084 15.2896 9.09272 15.2819 9.10429C15.2765 9.11248 15.2706 9.12101 15.2643 9.1294L15.2594 9.13588C15.2443 9.15568 15.2278 9.17444 15.2102 9.19204L15.2096 9.19256L10.6721 13.7113C10.4519 13.9305 10.0958 13.9298 9.87658 13.7097C9.67729 13.5096 9.65979 13.197 9.82363 12.9771L9.87823 12.9142L13.449 9.35724L3.5625 9.35679C3.25184 9.35679 3 9.10495 3 8.79429Z"
        fill="white"
      />
    </svg>
  );
}

export function Button({
  className = 'mt-[36px]',
  text,
  textColor,
  position = 'left',
  isArrow,
  color,
  type = 'link',
  link = '#',
  children,
  loading,
  disabledProps,
  ...props
}: IButtonCtaProps) {
  const transition = useTransition();
  const isRemoving = transition;
  return (
    <div
      className={`w-full lg:w-fit ${
        position === 'center' ? 'm-auto' : ''
      } flex items-center ${textColor} justify-center gap-x-6 ${
        position === 'left'
          ? 'lg:justify-start'
          : position === 'center'
          ? 'lg:justify-center'
          : position === 'right'
          ? 'lg:justify-end'
          : 'justify-center'
      } hover:opacity-70 transition duration-200 ${className} `}
    >
      {type === 'link' ? (
        <Link
          to={link}
          className={`${textColor} font-sledge-font-family-2 text-[12px] md:text-[16px] font-[700] leading-[18px] tracking-[-0.02em] py-[10px] md:py-[14px] px-[20px] md:px-[24px] rounded-[360px] ${color}`}
        >
          {text}
          {!isArrow ? null : <Arrow />}
          {children}
        </Link>
      ) : (
        <button
          type="submit"
          className={`${textColor} font-sledge-font-family-2 text-[12px] md:text-[16px] font-[700] leading-[18px] tracking-[-0.02em] py-[10px] md:py-[14px] px-[20px] md:px-[24px] rounded-[360px] disabled:opacity-70 ${color}`}
          disabled={
            (loading == 'submitting' || loading == 'loading' ? true : false) ||
            disabledProps
          }
          {...props}
        >
          {loading == 'submitting' || loading == 'loading' ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx={12}
                cy={12}
                r={10}
                stroke="currentColor"
                strokeWidth={4}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <>
              {text}
              {!isArrow ? null : <Arrow />}
            </>
          )}
          {children}
        </button>
      )}
    </div>
  );
}
