"use client";
import * as React from "react";
import { cn } from "../../lib/util";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { LuLock } from "react-icons/lu";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, id, ...props }, ref) => {
    const radius = 100; // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = React.useState(false);
    const [active, setActive] = useState<boolean>(false);

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          var(--blue-500),
          transparent 80%
        )
      `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[2px] rounded-lg transition duration-300 group/input"
      >
        <div className="relative block w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            {id === "email" && (
              <MdOutlineEmail className="text-neutral-600" />
            )}

            {id === "password" && (
              <LuLock className="text-neutral-600" />
            )}
          </span>
          <input
            type={type === "password" && active === false ? "password" : "text"}
            id={id}
            className={cn(
              `block h-10 w-full bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md pl-8 pr-3 py-2 text-sm file:bg-transparent 
            file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
            focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
            disabled:cursor-not-allowed disabled:opacity-50
            dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
            group-hover/input:shadow-none transition duration-400
            `,
              className
            )}
            ref={ref}
            {...props}
          />

          {id === "password" && active === false && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setActive(true)}
            >
              <FiEye className="text-neutral-600" />
            </button>
          )}

          {id === "password" && active === true && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setActive(false)}
            >
              <FiEyeOff className="text-neutral-600" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }
);
Input.displayName = "Input";

export { Input };
