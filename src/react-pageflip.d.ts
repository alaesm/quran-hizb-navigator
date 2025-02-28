import { HTMLFlipBook } from "react-pageflip";

declare module "react-pageflip" {
  interface HTMLFlipBookProps {
    direction?: "ltr" | "rtl";
    className?: string;
    style?: React.CSSProperties;
  }

  const HTMLFlipBook: React.ForwardRefExoticComponent<
    HTMLFlipBookProps & React.RefAttributes<HTMLFlipBook>
  >;
  
  export default HTMLFlipBook;
}