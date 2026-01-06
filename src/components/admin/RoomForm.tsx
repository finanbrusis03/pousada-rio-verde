import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Upload, Wifi, Wind, Coffee, Tv, Bath, Car, Dumbbell, Utensils, Shield, Volume2 } from 'lucide-react'
import { useRooms } from '@/hooks/useSupabase'

interface Room {
  id: string
  name: string
  description: string
  capacity: number
  price: number
  beds: string
  size: string
  status: 'available' | 'occupied' | 'maintenance'
  amenities: string[]
  images: string[]
  min_nights: number
  created_at: string
  updated_at: string
}

interface RoomFormProps {
  room?: Room
  onSave: (room: any) => void
  onCancel: () => void
  isOpen: boolean
}

const availableAmenities = [
  { id: 'wifi', label: 'Wi-Fi grátis', icon: Wifi },
  { id: 'ac', label: 'Ar-condicionado', icon: Wind },
  { id: 'breakfast', label: 'Café da manhã', icon: Coffee },
  { id: 'tv', label: 'TV Smart', icon: Tv },
  { id: 'bathroom', label: 'Banheiro privativo', icon: Bath },
  { id: 'parking', label: 'Estacionamento', icon: Car },
  { id: 'gym', label: 'Academia', icon: Dumbbell },
  { id: 'restaurant', label: 'Restaurante', icon: Utensils },
  { id: 'safe', label: 'Cofre', icon: Shield },
  { id: 'soundproof', label: 'Prova de som', icon: Volume2 },
]

export function RoomForm({ room, onSave, onCancel, isOpen }: RoomFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 2,
    price: 0,
    beds: '',
    size: '',
    status: 'available' as 'available' | 'occupied' | 'maintenance',
    amenities: [] as string[],
    images: [] as string[],
    min_nights: 1
  })

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || '',
        description: room.description || '',
        capacity: room.capacity || 2,
        price: room.price || 0,
        beds: room.beds || '',
        size: room.size || '',
        status: room.status || 'available',
        amenities: room.amenities || [],
        images: room.images || [],
        min_nights: room.min_nights || 1
      })
      setImagePreviews(room.images || [])
    }
  }, [room, isOpen])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles])
      
      // Create previews and save to public folder
      validFiles.forEach((file, index) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = e.target?.result as string
          setImagePreviews(prev => [...prev, preview])
          
          // Save image to public folder (simulated)
          // In a real app, you'd upload to a service
          const imageName = `room-${Date.now()}-${index}.jpg`
          const imageUrl = `https://picsum.photos/seed/${imageName}/400/300.jpg`
          
          // Add to form data
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, imageUrl]
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index)
      // Update formData to match
      setFormData(prev => ({
        ...prev,
        images: newPreviews.map((_, i) => prev.images[i]).filter(Boolean)
      }))
      return newPreviews
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prepare room data without complex image handling for now
    const roomData = {
      ...formData,
      // Use existing images or default
      images: formData.images.length > 0 ? formData.images : ['/placeholder.svg']
    }
    
    onSave(roomData)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      capacity: 2,
      price: 0,
      beds: '',
      size: '',
      status: 'available',
      amenities: [],
      images: [],
      min_nights: 1
    })
    setSelectedImages([])
    setImagePreviews([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-forest-900/90 border-sand-100/20">
        <CardHeader className="border-b border-sand-100/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sand-50">
              {room ? 'Editar Quarto' : 'Adicionar Novo Quarto'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4 text-sand-300" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sand-200">Nome do Quarto</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-forest-900/30 border-sand-100/20 text-sand-50"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-sand-200">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="bg-forest-900/30 border-sand-100/20 text-sand-50 min-h-[100px]"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="capacity" className="text-sand-200">Capacidade</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity || ''}
                        onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                        className="bg-forest-900/30 border-sand-100/20 text-sand-50"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price" className="text-sand-200">Preço/Diária</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        className="bg-forest-900/30 border-sand-100/20 text-sand-50"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="beds" className="text-sand-200">Camas</Label>
                      <Input
                        id="beds"
                        value={formData.beds}
                        onChange={(e) => handleInputChange('beds', e.target.value)}
                        className="bg-forest-900/30 border-sand-100/20 text-sand-50"
                        placeholder="Ex: 1 cama king size"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="size" className="text-sand-200">Tamanho</Label>
                      <Input
                        id="size"
                        value={formData.size}
                        onChange={(e) => handleInputChange('size', e.target.value)}
                        className="bg-forest-900/30 border-sand-100/20 text-sand-50"
                        placeholder="Ex: 35m²"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status" className="text-sand-200">Status</Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-sand-100/20 rounded-lg bg-forest-900/30 text-sand-50"
                      >
                        <option value="available">Disponível</option>
                        <option value="occupied">Ocupado</option>
                        <option value="maintenance">Manutenção</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="min_nights" className="text-sand-200">Mínimo de Noites</Label>
                      <Input
                        id="min_nights"
                        type="number"
                        value={formData.min_nights || ''}
                        onChange={(e) => handleInputChange('min_nights', parseInt(e.target.value) || 0)}
                        className="bg-forest-900/30 border-sand-100/20 text-sand-50"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Amenities */}
                <div>
                  <Label className="text-sand-200 mb-4 block">Comodidades</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableAmenities.map((amenity) => {
                      const Icon = amenity.icon
                      const isSelected = formData.amenities.includes(amenity.id)
                      return (
                        <div
                          key={amenity.id}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-accent/20 border-accent/50'
                              : 'bg-forest-900/30 border-sand-100/20 hover:bg-sand-100/10'
                          }`}
                          onClick={() => handleAmenityToggle(amenity.id)}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-accent' : 'text-sand-300'}`} />
                          <span className={`text-sm ${isSelected ? 'text-sand-50' : 'text-sand-300'}`}>
                            {amenity.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-sand-200 mb-4 block">Fotos do Quarto</Label>
                  
                  {/* Current Images */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="border-2 border-dashed border-sand-100/30 rounded-lg p-6 text-center hover:border-accent/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-sand-400" />
                      <span className="text-sand-300">
                        Clique para adicionar fotos ou arraste aqui
                      </span>
                      <span className="text-xs text-sand-400">
                        PNG, JPG, GIF (máx. 5MB por arquivo)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-sand-100/20">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="text-sand-300 hover:text-sand-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-forest-900"
              >
                {room ? 'Atualizar Quarto' : 'Adicionar Quarto'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
