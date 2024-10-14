import { motion, MotionProps } from "framer-motion";

export type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & { className?: string };

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  className = "",
  ...props
}) => (
  <motion.button
    className={`text-white px-4 py-2 rounded font-medium ${className} ${
      props.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-80"
    }`}
    {...props}
  >
    {children}
  </motion.button>
);

export default CustomButton;