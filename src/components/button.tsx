import React from 'react';

type ButtonProps = {
    variant?: 'orange' | 'gray'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({ className, children, variant = 'orange', ...rest }) => {
    return (
        <button
            className={`outline-none transition-all duration-300 bg-background
            ${variant === 'orange' ? 'bg-secondary hover:bg-accent active:bg-primary' : 'active:bg-opacity-60 hover:bg-secondary'} border-none text-white font-semibold text-md px-3
            py-2 rounded-md flex justify-center items-center ${className}`} {...rest} >
            {children}
        </button>
    )
}

export default Button;
