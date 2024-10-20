import React, {
  Children,
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { AccordionWrapper } from "./AccordionStyle";

export interface AccordionProps {
  expanded?: boolean;
  children: ReactNode; // Type for children
}

interface AccordionChildProps {
  open: boolean;
  onClick: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ expanded = false, children }) => {
  const [open, setOpen] = useState(expanded);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);

  // Typing the ref to HTMLDivElement
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const parent = ref.current;

    if (parent) {
      const firstChild = parent.children[0] as HTMLElement;
      setHeaderHeight(firstChild.scrollHeight);
      setParentHeight(parent.scrollHeight);
    }
  }, [ref.current]);

  // Type check and cast child element to accept `open` and `onClick`
  const modifiedChildren = Children.map(children, (child, ind) => {
    if (React.isValidElement<AccordionChildProps>(child)) {
      if (ind === 0) {
        return cloneElement(child, { open, onClick: toggle });
      }
      return child;
    }
    return child;
  });

  return (
    <AccordionWrapper ref={ref} height={open ? parentHeight : headerHeight}>
      {modifiedChildren}
    </AccordionWrapper>
  );
};

Accordion.defaultProps = {
  expanded: false,
};

export default Accordion;
