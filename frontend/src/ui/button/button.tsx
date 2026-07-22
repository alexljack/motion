import { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import cn from "../../utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  type?: string;
};

/** Primary UI component for user interaction */
const Button = ({
  children,
  className,
  type = "button",
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      type={type}
      className={cn(
        "py-1.5 px-3 rounded-lg bg-orange-500 cursor-pointer disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
