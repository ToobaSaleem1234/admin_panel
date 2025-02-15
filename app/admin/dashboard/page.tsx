'use client'
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { client } from '@/sanity/lib/client';
import React, { useEffect } from 'react'
import { useState } from 'react'
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';


interface Order {
    _id: string;
    firstName: string;
    lastName: string;
    phone: number;
    email: string;
    address: string;
    appartment: string;
    city: string;
    postalCode: number;
    zipCode: number;
    total: number;
    discount: number;
    orderDate: string;
    status: string | null;
    cartItems: { name: string, image: string }[]
}

const AdminDashboard = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const [filter, setFilter] = useState("All")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        client.fetch(`*[_type == "order"]{
            _id,
            firstName,
            lastName,
            phone,
            email,
            address,
            appartment,
            city,
            postalCode,
            zipCode,
            total,
            discount,
            orderDate,
            status,
            cartItems[] ->{
            name, image
            }
        }`).then((data) => setOrders(data))
            .catch((error) => console.log("error fetching products", error))
    }, [])

    const filteredOrders = filter === "All" ? orders : orders.filter((order: Order) => order.status === filter)

    const toggleOrderDetails = (orderId: string) => {
        setSelectedOrderId((prev) => (prev === orderId ? null : orderId))
    }
    const handleStatus = async (orderId: string, newStatus: string) => {
        try {
            await client.patch(orderId).set({ status: newStatus }).commit()
            setOrders((prevOrder) => prevOrder.map((order) => order._id === orderId ? { ...order, status: newStatus } : order))
            Swal.fire(
                'Updated!',
                'Order status has been updated.',
                'success'
            )
            if (newStatus === "dispatch") {
                Swal.fire(
                    'Dispatched!',
                    'Your order status has been dispatched.',
                    'success')
            }
            else if (newStatus === "success") {
                Swal.fire(
                    "success",
                    "Your order has been completed",
                    "success"
                )
            }
        } catch (error) {
            Swal.fire(
                'Error!',
                'Something went wrong',
                'error'
            )
        }

    }

    const handleDelete = async (orderId: string) => {

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
        if (!result.isConfirmed)
            return
        try {
            await client.delete(orderId)
            setOrders((prevOrder) => prevOrder.filter((order) => order._id !== orderId))
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        } catch (error) {
            Swal.fire(
                'Error!',
                'Something went wrong',
                'error'
            )
        }
    }

    return (
        <ProtectedRoute>
            <div className="flex flex-col h-screen bg-gray-100">

                <nav className="bg-purple-600 text-white p-4 shadow-lg flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
                    <div className="hidden md:flex space-x-8">
                        {/* Hide on mobile */}
                        {["All", "pending", "success", "dispatch"].map((status) => (
                            <Button
                                key={status}
                                className={`px-4 text-xl py-2 font-bold rounded-xl transition-all ${filter === status ? "bg-white text-[#151875] font-bold" : "hover:bg-white text-[#151875]"}`}
                                onClick={() => setFilter(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Button>
                        ))}
                    </div>

                    {/* Mobile version of the buttons */}
                    <div className="md:hidden">
                        {/* Visible on mobile only */}
                        <button
                            className="text-white focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} // Toggle menu state
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu (visible when mobileMenuOpen is true) */}
                {mobileMenuOpen && (
                    <div className="bg-purple-600 text-white py-2 space-y-2 md:hidden">
                        {["All", "pending", "success", "dispatch"].map((status) => (
                            <Button
                                key={status}
                                className={`block w-full px-4 text-xl py-2 font-bold rounded-xl transition-all ${filter === status ? "bg-white text-[#151875] font-bold" : "hover:bg-white text-[#151875]"}`}
                                onClick={() => setFilter(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Main Content */}

                <div className='flex-1 overflow-y-auto p-6'>
                    <h2 className='text-2xl font-bold text-center mb-6'>Orders:</h2>

                    {/* Table wrapper for smaller screens */}
                    <div className='bg-white rounded-lg shadow-lg'>
                        <div className="block md:hidden overflow-x-auto mb-4">
                            {/* Order List for mobile */}
                            {filteredOrders.map((order) => (
                                <div key={order._id} className='p-4 mb-4 border-b max-w-full'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex justify-between capitalize'>
                                            <span className='font-bold'>Order ID:</span> {order._id}
                                        </div>
                                        <div className='flex justify-between capitalize'>
                                            <span className='font-bold'>Customer Name:</span> {order.firstName} {order.lastName}
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='font-bold'>Customer Email:</span> {order.email}
                                        </div>
                                        <div className='flex justify-between capitalize'>
                                            <span className='font-bold'>Customer Address:</span> {order.address}
                                        </div>
                                        <div className='flex justify-between capitalize'>
                                            <span className='font-bold'>Order Date:</span> {new Date(order.orderDate).toLocaleDateString()}
                                        </div>
                                        <div className='flex justify-between capitalize'>
                                            <span className='font-bold'>Total:</span> ${order.total}

                                        </div>
                                        {/* Status */}
                                        <div className='flex justify-between capitalize'>
                                            <span className='font-bold'>Status:</span>
                                            <select value={order.status || ''} onChange={(e) => handleStatus(order._id, e.target.value)} className='bg-gray-100 p-1 rounded'>
                                                <option value="pending">Pending</option>
                                                <option value="dispatch">Dispatch</option>
                                                <option value="success">Success</option>
                                            </select>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className='flex space-x-4 mt-4 justify-between'>
                                            <Button onClick={(e) => { e.stopPropagation(); handleDelete(order._id); }} className='bg-gradient-to-r from-blue-800 to-purple-400 text-white p-2 rounded-lg'>
                                                Delete
                                            </Button>
                                            <Button onClick={() => toggleOrderDetails(order._id)} className='bg-gradient-to-r from-blue-800 to-purple-400 text-white p-2 rounded-lg'>
                                                Show Details
                                            </Button>
                                        </div>

                                        {/* Show Order Details */}
                                        {selectedOrderId === order._id && (
                                            <div className='mt-4 flex gap-2 flex-col'>
                                                <h2 className='font-bold'>Order Details</h2>
                                                <p className='font-bold flex justify-between capitalize'>Phone: <strong className='font-thin'>{order.phone}</strong></p>
                                                <p className='font-bold flex justify-between capitalize'>Appartment: <strong className='font-thin'>{order.appartment}</strong></p>
                                                <p className='font-bold flex justify-between capitalize'>City: <strong className='font-thin'>{order.city}</strong></p>
                                                <p className='font-bold flex justify-between capitalize'>Discount: <strong className='font-thin'>{order.discount}</strong></p>
                                                <p className='font-bold flex justify-between capitalize'>Postal Code: <strong className='font-thin'>{order.postalCode}</strong></p>
                                                <p className='font-bold flex justify-between capitalize'>Zip Code: <strong className='font-thin'>{order.zipCode}</strong></p>

                                                <h2 className='text-lg font-bold py-4'>Cart Items:</h2>
                                                <ul className='flex flex-col'>
                                                    {order.cartItems.map((item, index) => (
                                                        <li key={`${order._id}- ${index}`} className='flex justify-between'>
                                                            <span className='w-[200px] truncate'>{item.name}</span>
                                                            {item.image &&
                                                                <Image
                                                                    src={urlFor(item.image).url()}
                                                                    alt={item.name}
                                                                    width={65}
                                                                    height={65}
                                                                    className='w-14 h-14 object-cover'
                                                                />}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* For larger screens (tablet & desktop) */}
                        <div className='flex-1 overflow-y-auto p-6'>
                            <h2 className='text-2xl font-bold text-left mb-6'>Order List:</h2>

                            <div className='bg-white rounded-lg shadow-lg w-full'>
                                {/* Table for Tablet to Laptop screens */}
                                <table className='min-w-full w-full divide-y-4 divide-gray-200'>
                                    <thead>
                                        <tr>
                                            <th className='p-4 text-left text-sm font-bold text-black pl-16'>Order Id</th>
                                            <th className='p-4 pl-6 text-left text-sm font-bold text-black'>Customer Name</th>
                                            <th className='p-4  pl-8 text-left text-sm font-bold text-black'>Customer Address</th>
                                            <th className='p-4 pl-8 text-left text-sm font-bold text-black'>Order Date</th>
                                            <th className='p-4 pl-8 text-left text-sm font-bold text-black'>Total</th>
                                            <th className='p-4 pl-8 text-left text-sm font-bold text-black'>Status</th>
                                            <th className='p-4 pl-8 text-left text-sm font-bold text-black'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y-2 divide-gray-200'>
                                        {filteredOrders.map((order) => (
                                            <React.Fragment key={order._id}>
                                                <tr className='cursor-pointer hover:bg-purple-100 transition-all' onClick={() => toggleOrderDetails(order._id)}>
                                                    <td className='p-4 pl-8 sm:pl-12'>{order._id}</td>
                                                    <td className='p-4 pl-8 capitalize'>{order.firstName} {order.lastName}</td>
                                                    <td className='p-4 pl-8 capitalize'>{order.address}</td>
                                                    <td className='p-4 pl-8'>{new Date(order.orderDate).toLocaleDateString()}</td>
                                                    <td className='p-4 pl-8'>${order.total}</td>
                                                    <td>
                                                        <select value={order.status || ''} onChange={(e) => handleStatus(order._id, e.target.value)} className='bg-gray-100 p-1 rounded'>
                                                            <option value="pending">Pending</option>
                                                            <option value="dispatch">Dispatch</option>
                                                            <option value="success">Success</option>
                                                        </select>
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <Button onClick={(e) => { e.stopPropagation(); handleDelete(order._id); }} className='bg-gradient-to-r from-blue-800 to-purple-400 text-white p-2 rounded-lg'>
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>

                                                {/* Order Details */}
                                                {selectedOrderId === order._id && (
                                                    <tr>
                                                        <td colSpan={7} className='bg-gray-50 p-4'>

                                                            <h2 className='font-bold text-lg py-7'>Order Details</h2>
                                                            <p className='font-bold'>E-mail: <strong className='font-thin px-2'>{order.email}</strong></p>
                                                            <p className='font-bold '>Phone: <strong className='font-thin px-2'>{order.phone}</strong></p>
                                                            <p className='font-bold'>Appartment: <strong className='font-thin px-2'>{order.appartment}</strong></p>
                                                            <p className='font-bold'>City: <strong className='font-thin px-2'>{order.city}</strong></p>
                                                            <p className='font-bold'>Discount: <strong className='font-thin px-2'>{order.discount}</strong></p>
                                                            <p className='font-bold'>Postal Code: <strong className='font-thin px-2'>{order.postalCode}</strong></p>
                                                            <p className='font-bold'>Zip Code: <strong className='font-thin px-2'>{order.zipCode}</strong></p>


                                                            <h2 className='text-lg font-bold py-4'>Cart Items:</h2>
                                                            <ul className='flex flex-col'>
                                                                {order.cartItems.map((item, index) => (
                                                                    <li key={`${order._id}- ${index}`} className='flex justify-between w-[600px]'>
                                                                        <span className='w-[200px] truncate'>{item.name}</span>
                                                                        {item.image &&
                                                                            <Image
                                                                                src={urlFor(item.image).url()}
                                                                                alt={item.name}
                                                                                width={65}
                                                                                height={65}
                                                                                className='w-14 h-14 object-cover'
                                                                            />}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>



                    </div>
                </div>


            </div>
        </ProtectedRoute>

    )
};
export default AdminDashboard