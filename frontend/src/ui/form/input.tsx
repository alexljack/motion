import { InputHTMLAttributes } from "react";
import cn from "../../utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  className?: string;
};

function Input({ className, label, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1.5">
      {label}
      <input
        className={cn(
          "py-1 px-2.5 border border-gray-400 rounded-lg active:border-gray-500",
          "placeholder:text-gray-300",
          className,
        )}
        {...props}
      />
    </label>
  );
}

export default Input;
