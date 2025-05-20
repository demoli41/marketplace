import { forwardRef } from 'react';

interface BaseProps {
    label?: string;
    type?: "text" | "email" | "password" | "number" | "textarea";
    className?: string;
}

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;

type TextAreaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type Props = InputProps | TextAreaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
    ({
        label, type='text', className, ...props}, ref)=> {
        return(
            <div className='w-full'>
                {label && (
                    <label className='block font-semibold text-gray-300 mb-1'>
                        {label}
                    </label>
                )}

                {type === 'textarea' ? (
                    <textarea 
                    {...(props as TextAreaProps)}
                    className={`w-full border outline-none border-gray-700 bg-transparent p-2 !rounded-md text-white ${className}`}
                    ref={ref as React.Ref<HTMLTextAreaElement>}/> 
                ) : (
                   <input type={type} 
                   ref={ref as React.Ref<HTMLInputElement>}
                   className={`w-full border outline-none border-gray-700 bg-transparent p-2 !rounded-md text-white ${className}`}
                   {...(props as InputProps)}
                   /> 
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;