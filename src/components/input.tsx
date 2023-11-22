import React from 'react'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...rest }) => {
  return (
    <input {...rest} className={`${className} border bg-black text-white px-4 py-2 border-secondary rounded-md outline-none`} />
  )
}

export default Input;
