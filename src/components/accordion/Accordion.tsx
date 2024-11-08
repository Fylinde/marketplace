import React, {
  Children,
  cloneElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { AccordionWrapper } from "./AccordionStyle";

export interface AccordionProps {
  expanded?: boolean;
  children: ReactNode;
}

interface AccordionChildProps {
  open: boolean;
  onClick: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ expanded = false, children }) => {
  const [open, setOpen] = useState(expanded);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);

  // Ref for the parent element of Accordion
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const parent = ref.current;

    if (parent) {
      const firstChild = parent.children[0] as HTMLElement | undefined;

      if (firstChild) {
        setHeaderHeight(firstChild.scrollHeight);
        setParentHeight(parent.scrollHeight);
      }
    }
  }, []);

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
