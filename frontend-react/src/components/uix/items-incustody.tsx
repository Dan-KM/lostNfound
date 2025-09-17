import { API } from '@/lib/API'
import { useEffect, useState, useMemo } from 'react'
import { Input } from '../ui/input'

import {
  Search,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'

import { ResponsiveShadcnTable } from '@/components/uix/responsive-table'

const ItemInCustody = () => {
  const [userItems, setUserItems] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    getItems()
  }, [])

  async function getItems() {
    try {
      const res = await API.get('inventory/user-item/')
      setUserItems(res.data)
    } catch (error) {
      console.error('Error fetching items', error)
    }
  }

  async function handleDeleteItem(id: number) {
    try {
      const resp = await API.delete(`inventory/user-item/${id}/`)
      console.log('Item deleted:', resp.data)
      getItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const getStats = () => {
    return [
      {
        title: 'Lost Items Reported',
        value: userItems.filter(item => item.item.item_type === 'lost').length,
        icon: Search,
        color: 'text-orange-600',
      },
      {
        title: 'Found Items Reported',
        value: userItems.filter(item => item.item.item_type === 'found').length,
        icon: Search,
        color: 'text-orange-600',
      },
      {
        title: 'Items Returned',
        value: userItems.filter(item => item.status === 'returned').length,
        icon: CheckCircle,
        color: 'text-green-600',
      },
    ]
  }

  const canDelete = (reportedDate: string) => {
    const reported = new Date(reportedDate)
    const now = new Date()
    const diffInHours = (now.getTime() - reported.getTime()) / (1000 * 60 * 60)
    return diffInHours <= 24
  }

  const filteredItems = useMemo(() => {
    return userItems.filter(item => {
      const matchesSearch =
        item.serial_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item.subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesType = typeFilter === 'all' || item.item.item_type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [userItems, searchTerm, statusFilter, typeFilter])

  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(userItems.map(item => item.status))]
    return statuses.filter(status => status)
  }, [userItems])

  return (
    <div className="w-full p-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {getStats().map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:w-48">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-slate-600">
        Showing {filteredItems.length} of {userItems.length} items
      </div>

      <ResponsiveShadcnTable
        userItems={filteredItems}
        handleDeleteItem={handleDeleteItem}
        canDelete={canDelete}
      />
    </div>
  )
}

export default ItemInCustody
