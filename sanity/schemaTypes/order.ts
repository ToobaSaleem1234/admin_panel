import { title } from "process";

export default {
    name: "order",
    type: "document",
    title: "Order",
    fields :[
        {
            name: "firstName",
            title : "First Name",
            type: "string"
        },
        {
            name: "lastName",
            title : "Last Name",
            type: "string"
        },
        {
            name: "address",
            title : "Address",
            type: "string"
        },
        {
            name: "city",
            title : "City",
            type: "string"
        },
        {
            name: "appartment",
            title : "Appartment",
            type: "string"
        },
        {
            name: "zipCode",
            title : "Zip Code",
            type: "string"
        },
        {
            name: "postalCode",
            title : "Postal Code",
            type: "string"
        },
        {
            name: "phone",
            title : "Phone",
            type: "string"
        },
        {
            name: "email",
            title : "Email",
            type: "string"
        },
        {
            name: "total",
            title : "Total",
            type: "number"
        },
        {
            name: "discount",
            title : "Discount",
            type: "number"
        },
        {
            name : "orderDate",
            title : "Order Date",
            type: "datetime"
        },
        {
            name: "cartItems",
            title : "Cart Items",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: {type: "product"}
                }
            ]
        },
        {
            name:"status",
            title:"Order Status",
            type:"string",
            options :{
                list: [
                    {title: "Pending", value: "pending"},
                    {title: "Completed", value: "completed"},
                    {title: "Cancelled", value: "cancelled"},
                ],
                layout: "radio"
            },
            initialValue: "pending"
        }
    ]
}