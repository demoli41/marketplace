import { X } from 'lucide-react'
import React from 'react'

const DeleteConfirmationModal = ({
    product,
    onClose,
    onConfirm,
    onRestore}:any) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
        <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-[450px]'>
            {/*Header*/}
            <div className='flex justify-between items-center border-b border-gray-700 pb-3'>
                <h3 className='text-xl text-white'>Видалити товар</h3>
                <button onClick={onClose} className='text-gray-400 hover:text-white'>
                    <X size={22} />
                </button>
            </div>

            {/*Body*/}
            <p className='text-gray-300 mt-4'>
                Ви впевнені, що хочете видалити товар{" "}<span className='font-semibold text-white'>{product.title}</span>?
                <br />
                Товар буде переміщено до кошика видалених товарів, де ви зможете його відновити протягом 24 годин.
            </p>

            {/*Action buttons*/}
            <div className='flex justify-end gap-3 mt-6'>
                <button
                    onClick={onClose}
                    className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition'
                >
                    Скасувати
                </button>
                <button
                    onClick={!product?.isDeleted ? onConfirm : onRestore}
                    className={`${product?.isDeleted ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-4 py-2 rounded-md transition font-semibold`}
                >
                    {product?.isDeleted ? 'Відновити' : 'Видалити'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default DeleteConfirmationModal