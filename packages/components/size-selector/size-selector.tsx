import { Controller } from "react-hook-form";

const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const SizeSelector = ({ control, errors }: any) => {
    return (
        <div className="mt-2">
            <label className="block font-semibold text-gray-300 mb-1">Розміри</label>
            <Controller
                name="sizes"
                control={control}
                render={({ field }) => (
                    <div className="flex gap-2 flex-wrap">
                        {sizes.map((size) => {
                            const isSelected = (field.value || []).includes(size);

                            return (
                                <button
                                    type="button"
                                    key={size}
                                    onClick={() =>
                                        field.onChange(
                                            isSelected
                                                ? field.value.filter((s: string) => s !== size)
                                                : [...field.value || [], size]
                                        )
                                    }
                                    className={`px-3 py-1 rounded-lg font-Poppins transition-colors ${
                                        isSelected ? "bg-gray-700 text-white border border-[#ffffff6b]" : "bg-gray-600 text-gray-300 "}`}
                                >{size}</button>
                            )
                        })}
                    </div>
                )}
            />
        </div>
    )
}

export default SizeSelector;