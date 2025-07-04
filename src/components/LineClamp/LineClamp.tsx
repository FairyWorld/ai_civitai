import type { TextProps } from '@mantine/core';
import { Text } from '@mantine/core';
import type { Key } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { findNearestAncestorWithProps } from '~/utils/html-helpers';
import { useResizeObserver } from '~/hooks/useResizeObserver';
import { useMergedRef } from '@mantine/hooks';

type LineClampProps = TextProps & { children: React.ReactNode; id?: Key; lineClamp?: number };

export const LineClamp = forwardRef<HTMLParagraphElement, LineClampProps>(
  ({ children, lineClamp = 3, className, id, ...props }, ref) => {
    const [clamped, setClamped] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const backgroundColorRef = useRef<string | null>(null);
    const prevWidthRef = useRef<number | null>(null);

    const resizeObserverRef = useResizeObserver<HTMLParagraphElement>((entry) => {
      if (!prevWidthRef.current || prevWidthRef.current !== entry.contentRect.width) {
        prevWidthRef.current = entry.contentRect.width;
        const element = entry.target as HTMLElement;
        const shouldClamp = element.clientHeight < element.scrollHeight;
        setClamped(shouldClamp);
      }
    });

    // useEffect(() => {
    //   const elem = resizeObserverRef.current;
    //   if (!elem) return;

    //   function callback() {
    //     const elem = resizeObserverRef.current;
    //     if (!elem) return;
    //     // can only set clamped to true. This handles cases where text is injected into divs outside of the react ecysystem
    //     setClamped((clamped) => clamped || elem.clientHeight < elem.scrollHeight);
    //   }

    //   const observer = new MutationObserver(callback);
    //   observer.observe(elem, { subtree: true, childList: true });
    //   return () => {
    //     observer.disconnect();
    //   };
    // }, []);

    const mergedRef = useMergedRef(resizeObserverRef, ref);

    function toggleShowMore() {
      setShowMore((s) => !s);
    }

    if (clamped && !backgroundColorRef.current)
      backgroundColorRef.current =
        findNearestAncestorWithProps(resizeObserverRef.current, (elem) => {
          const bg = getComputedStyle(elem).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
        }) ?? null;

    const style: Record<string, unknown> = {};
    if (backgroundColorRef.current) style['--bg-ancestor'] = backgroundColorRef.current;

    return (
      <Text
        id={id}
        ref={mergedRef}
        component="div"
        lineClamp={!showMore ? lineClamp : undefined}
        {...props}
        className={clsx('relative break-words', className)}
      >
        {children}
        {clamped && !showMore && (
          <span
            className="absolute bottom-0 right-0 flex select-none items-end bg-[--bg-ancestor] before:absolute before:inset-y-0 before:-left-8 before:w-8 before:bg-gradient-to-r before:from-transparent before:to-[--bg-ancestor]"
            style={style}
          >
            <span className="mr-1 tracking-wide">...</span>
            <Text
              c="blue.4"
              component="span"
              className="cursor-pointer text-[length:inherit]"
              onClick={toggleShowMore}
            >
              Show more
            </Text>
          </span>
        )}
        {clamped && showMore && (
          <Text
            c="blue.4"
            component="span"
            className="ml-1 cursor-pointer select-none text-[length:inherit]"
            onClick={toggleShowMore}
          >
            Show less
          </Text>
        )}
      </Text>
    );
  }
);

LineClamp.displayName = 'LineClamp';

// export function LineClamp({
//   children,
//   lineClamp = 3,
//   className,
//   ...props
// }: TextProps & { children: React.ReactNode; lineClamp?: number }) {
//   // const ref = useRef<HTMLDivElement | null>(null);
//   const [clamped, setClamped] = useState(false);
//   const [showMore, setShowMore] = useState(false);
//   const backgroundColorRef = useRef<string | null>(null);
//   const prevWidthRef = useRef<number | null>(null);

//   const ref = useResizeObserver<HTMLParagraphElement>((entry) => {
//     if (!prevWidthRef.current || prevWidthRef.current !== entry.contentRect.width) {
//       prevWidthRef.current = entry.contentRect.width;
//       const element = entry.target as HTMLElement;
//       const shouldClamp = element.clientHeight < element.scrollHeight;
//       setClamped(shouldClamp);
//     }
//   });

//   function toggleShowMore() {
//     setShowMore((s) => !s);
//   }

//   if (clamped && !backgroundColorRef.current)
//     backgroundColorRef.current =
//       findNearestAncestorWithProps(ref.current, (elem) => {
//         const bg = getComputedStyle(elem).backgroundColor;
//         if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
//       }) ?? null;

//   const style: Record<string, unknown> = {};
//   if (backgroundColorRef.current) style['--bg-ancestor'] = backgroundColorRef.current;

//   return (
//     <Text
//       ref={ref}
//       lineClamp={!showMore ? lineClamp : undefined}
//       {...props}
//       className={clsx('relative break-words', className)}
//     >
//       {children}
//       {clamped && !showMore && (
//         <span
//           className="absolute bottom-0 right-0 flex select-none items-end bg-[--bg-ancestor] before:absolute before:inset-y-0 before:-left-8 before:w-8 before:bg-gradient-to-r before:from-transparent before:to-[--bg-ancestor]"
//           style={style}
//         >
//           <span className="mr-1 tracking-wide">...</span>
//           <Text
//             c="blue.4"
//             component="span"
//             className="cursor-pointer text-[length:inherit]"
//             onClick={toggleShowMore}
//           >
//             Show more
//           </Text>
//         </span>
//       )}
//       {clamped && showMore && (
//         <Text
//           c="blue.4"
//           component="span"
//           className="ml-1 cursor-pointer select-none text-[length:inherit]"
//           onClick={toggleShowMore}
//         >
//           Show less
//         </Text>
//       )}
//     </Text>
//   );
// }
