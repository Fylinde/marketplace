import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import StyledSticky from "./SickyStyle";

export interface StickyProps {
  fixedOn: number;
  containerRef?: { current: any };
  children?: ReactElement;
  onSticky?: (isFixed: boolean) => void;
  notifyOnScroll?: (hasReachedPosition: boolean) => void;
  notifyPosition?: number;
}

const Sticky: React.FC<StickyProps> = ({
  fixedOn,
  containerRef,
  children,
  notifyPosition,
  notifyOnScroll,
  onSticky,
}) => {
  const [fixed, setFixed] = useState(false);
  const [parentHeight, setParentHeight] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null); // Use proper type for elementRef
  const positionRef = useRef<number | null>(null); // Initialize positionRef as number or null

  const scrollListener = useCallback(() => {
    if (positionRef.current === null || !window) return; // Guard for positionRef being null

    const distance = window.pageYOffset - positionRef.current;

    if (containerRef?.current) {
      const containerDistance =
        containerRef.current.offsetTop +
        containerRef.current?.offsetHeight -
        window.pageYOffset;

      if (notifyPosition && notifyOnScroll) {
        notifyOnScroll(
          distance <= notifyPosition && containerDistance > notifyPosition
        );
      }
      return setFixed(distance <= fixedOn && containerDistance > fixedOn);
    }

    if (notifyPosition && notifyOnScroll) {
      notifyOnScroll(distance >= notifyPosition);
    }

    const isFixed = distance >= fixedOn;
    setFixed(isFixed);
  }, [fixedOn, notifyOnScroll, notifyPosition, containerRef]);

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);
    window.addEventListener("resize", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
      window.removeEventListener("resize", scrollListener);
    };
  }, [scrollListener]);

  useEffect(() => {
    if (elementRef.current && positionRef.current === null) {
      // Safely set positionRef when elementRef is available
      positionRef.current = elementRef.current.offsetTop || 0; // Fallback to 0
    }
    setParentHeight(elementRef.current?.offsetHeight || 0);
  }, [elementRef.current, children]);

  useEffect(() => {
    if (onSticky) onSticky(fixed);
  }, [fixed, onSticky]);

  return (
    <StyledSticky
      componentPosition={positionRef.current || 0} // Fallback to 0 if positionRef is null
      componentHeight={parentHeight}
      fixedOn={fixedOn}
      fixed={fixed}
      ref={elementRef}
    >
      {children ? React.cloneElement(children, { isFixed: fixed }) : null}
    </StyledSticky>
  );
};

export default Sticky;
