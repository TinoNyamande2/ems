"use client"
import { ProductCreate, ProductCreateDefaultvalues } from "@/interfaces/product";
import { useState, ChangeEvent, SyntheticEvent } from "react";

export default function Page () {
    const [inputs, setInputs] = useState<ProductCreate>(ProductCreateDefaultvalues);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const onFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputs((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }))
    }
    const onCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setInputs((prevInputs) => ({ ...prevInputs, ['category']: event?.target.value }))
    }
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedImage(event.target.files[0])
        }
    }
    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        const formData = new FormData();
        if (selectedImage) {
            formData.append('image', selectedImage);
            const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY
            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    setInputs((prevInputs) => ({ ...prevInputs, ['mainimageurl']: data.data.url }));
                }
            } catch (error) {
                console.log(error)
            }
        }

    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-xl4 p-8 space-y-8 bg-white rounded shadow-md">
                <h2 className="text-center text-4xl font-extrabold text-gray-900">
                    Enter Product details
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="title" className="sr-only">
                                Product Name
                            </label>
                            <input
                                id="title"
                                name="title"
                                onChange={onFormChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Product Name"
                            />
                        </div>
                        <br />

                        <div className='mb-8'>
                            <label className="sr-only">
                                Description
                            </label>
                            <input
                                id="description"
                                name="description"
                                onChange={onFormChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Description"
                            />
                        </div>
                        <br />
                        <div className="mb-8 mt-8">
                            <label htmlFor="category" className="sr-only">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                onChange={onCategoryChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            >
                                <option value="" disabled>
                                    Select Category
                                </option>
                                <option value="rent">Rent</option>
                                <option value="sale">Sale</option>
                            </select>
                        </div>

                        <br />
                        <div className='mb-8 mt-8'>
                            <label htmlFor="delivery" className="sr-only">
                                Delivery Information
                            </label>
                            <input
                                id="delivery"
                                name="delivery"
                                onChange={onFormChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Delivery"
                            />
                        </div>
                        <br />
                        <div className='mb-8'>
                            <label htmlFor="salesprice" className="sr-only">
                                Price
                            </label>
                            <input
                                id="salesprice"
                                name="salesprice"
                                type="salesprice"
                                onChange={onFormChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Price"
                            />
                        </div>
                    </div>
                    <br />
                    <div>
                        <input type='file' onChange={handleFileChange} />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save
                        </button>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

