import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { useEffect, useState } from 'react';
import { API } from '@/lib/API';

type categories = {
    id: number;
    name: string;
    subcategory: {
        id: number;
        category: number;
        name: string;
    }[];
}

export const CategorySelect = ({setCategory}:{setCategory: (value : String) => void;}) => {
    const handleChange = (value: string) => {
        setCategory(value)
    }
    const [categories, setCategories] = useState<categories[] | undefined>()

    useEffect(() => {
        let mounted = true;
        async function getCategories() {
            try{
                const response = await API.get('inventory/item-categories/');
                if (mounted) {
                    setCategories(response.data);
                }
            }catch(error){
                console.error(error)
            }
        }
        getCategories();
        return () => {
            mounted = false;
        };
    }, []);
    
  return (
    <>
    <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
    <Select onValueChange={(value) => handleChange(value)}>
    <SelectTrigger>
        <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent>
        {categories && categories.map((cat) => (
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
