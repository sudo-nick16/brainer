import React, { forwardRef, useEffect, useRef } from 'react'

type OutsideClickWrapperProps = React.DOMAttributes<HTMLElement> & React.AllHTMLAttributes<HTMLElement> & {
    onOutsideClick: <Args extends any[]>(...args: [MouseEvent, ...Args]) => void;
    as?: keyof JSX.IntrinsicElements;
    listenerState?: boolean
}

type Ref = HTMLElement;

const OutsideClickWrapper = forwardRef<Ref, OutsideClickWrapperProps>((props, compRef) => {
    const { onOutsideClick, as: Tag = 'div', listenerState = true, children, ...rest } = props;
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        if (!listenerState) {
            return;
        }
        const handleOutsideClick = (e: MouseEvent) => {
            if (e.target != ref.current && !ref.current?.contains(e.target as Node)) {
                onOutsideClick(e);
            }
        }
        window.addEventListener('mousedown', handleOutsideClick);
        return () => {
            window.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [listenerState])
    return (
        // @ts-expect-error - ts is bad
        <Tag
            {...rest}
            // @ts-expect-error - ts is bad
            ref={(e: HTMLElement) => {
                // @ts-expect-error - ts is bad
                ref.current = e;
                if (compRef) {
                    // @ts-expect-error - ts is bad
                    compRef.current = e;
                }
            }}
        > {children} </Tag >
    )
})

export default OutsideClickWrapper;
