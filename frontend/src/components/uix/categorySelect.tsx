import React, { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';


const categories = [
    {
        "id": 1,
        "name": "electronics",
        "subcategory": [
            {
                "id": 1,
                "category": 1,
                "name": "phone"
            },
            {
                "id": 2,
                "category": 1,
                "name": "laptop"
            },
            {
                "id": 3,
                "category": 1,
                "name": "charger"
            },
            {
                "id": 5,
                "category": 1,
                "name": "headphones"
            }
        ]
    },
    {
        "id": 2,
        "name": "clothing",
        "subcategory": [
            {
                "id": 4,
                "category": 2,
                "name": "jacket"
            }
        ]
    },
    {
        "id": 3,
        "name": "personal items",
        "subcategory": [
            {
                "id": 6,
                "category": 3,
                "name": "keys"
            }
        ]
    }
]

export const CategorySelect = ({setCategory}:{setCategory: (value : String) => void;}) => {
    const handleChange = (value: string) => {
        setCategory(value)
    }
  return (
    <>
    <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
    <Select onValueChange={(value) => handleChange(value)}>
    <SelectTrigger>
        <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent>
        {categories.map((cat) => (
        <SelectGroup key={cat.id}>
            <SelectLabel className="font-bold text-black capitalize text-center w-full">{cat.name}</SelectLabel>
            {cat.subcategory.map((sub) => (
            <SelectItem key={sub.name}  value={`${cat.id}:${sub.id}`}>
                {sub.name}
            </SelectItem>
            ))}
        </SelectGroup>
        ))}
    </SelectContent>
    </Select>

    </>
  )
}
