import { useState, useEffect, useCallback } from 'react'
import { supabase, Database } from '@/lib/supabase'
import type { Room, Reservation, Client, Payment } from '@/lib/supabase'
import { uploadImage, deleteImage } from '@/lib/storage'

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching rooms:', error)
      } else {
        setRooms(data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  const createRoom = async (roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Garante que as imagens sejam um array vazio se não fornecidas
      const roomToCreate = {
        ...roomData,
        images: Array.isArray(roomData.images) ? roomData.images : [],
        status: roomData.status || 'available',
        amenities: Array.isArray(roomData.amenities) ? roomData.amenities : [],
        min_nights: roomData.min_nights || 1
      }

      const { data, error } = await supabase
        .from('rooms')
        .insert(roomToCreate)
        .select()
        .single()

      if (error) throw error

      await fetchRooms()
      return data
    } catch (error) {
      console.error('Error creating room:', error)
      throw new Error('Erro ao criar o quarto. Por favor, tente novamente.')
    }
  }

  const updateRoom = async (id: string, updates: Partial<Room>) => {
    try {
      console.log('Updating room:', id, updates)
      
      // Verifica se o quarto existe antes de atualizar
      const { data: existingRoom, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !existingRoom) {
        console.error('Room not found:', id, fetchError)
        throw new Error('Quarto não encontrado')
      }

      // Atualiza apenas os campos fornecidos
      const roomToUpdate = { ...updates, updated_at: new Date().toISOString() }

      const { data, error } = await supabase
        .from('rooms')
        .update(roomToUpdate)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('Nenhum dado retornado ao atualizar o quarto')

      await fetchRooms()
      return data
    } catch (error) {
      console.error('Error updating room:', error)
      throw new Error(`Erro ao atualizar o quarto: ${error.message}`)
    }
  }

  const deleteRoom = async (id: string) => {
    try {
      // Primeiro, obtém o quarto para deletar as imagens
      const { data: room, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Deleta as imagens do storage
      if (room?.images?.length) {
        await Promise.all(
          room.images.map(async (imgUrl: string) => {
            if (imgUrl.includes('supabase.co/storage/v1/object/public/images/')) {
              await deleteImage(imgUrl).catch(console.error)
            }
          })
        )
      }

      // Deleta o quarto do banco de dados
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchRooms()
      return true
    } catch (error) {
      console.error('Error deleting room:', error)
      throw new Error('Erro ao excluir o quarto. Por favor, tente novamente.')
    }
  }

  // Função auxiliar para processar imagens de um quarto
  const processRoomImages = (room: Room) => {
    // Garante que images seja sempre um array
    const images = Array.isArray(room.images) ? room.images : []
    
    // Filtra apenas URLs válidas
    const validImages = images.filter(img => 
      img && (typeof img === 'string') && 
      (img.startsWith('http') || img.startsWith('blob:') || img.startsWith('/'))
    )
    
    return {
      ...room,
      images: validImages,
      amenities: Array.isArray(room.amenities) ? room.amenities : []
    }
  }

  const getRoom = async (id: string) => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching room:', error)
      throw new Error('Erro ao buscar o quarto')
    }

    if (!data) {
      throw new Error('Quarto não encontrado')
    }

    return processRoomImages(data)
  }

  const checkAvailability = async (
    roomId: number,
    checkinDate: string,
    checkoutDate: string
  ) => {
    // Check if room is available for the dates
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('room_id', roomId)
      .in('status', ['confirmed', 'paid'])
      .or(`checkin_date.lte.${checkinDate},checkout_date.gte.${checkinDate}`)

    if (error) {
      console.error('Error checking availability:', error)
      return false
    }

    // Also check blocked dates
    const { data: blockedDates } = await supabase
      .from('blocked_dates')
      .select('*')
      .eq('room_id', roomId)
      .or(`start_date.lte.${checkinDate},end_date.gte.${checkinDate}`)

    return !data?.length && !blockedDates?.length
  }

  // Processa os quartos para garantir que as imagens estejam corretas
  const processedRooms = rooms.map(room => processRoomImages(room))

  return {
    rooms: processedRooms,
    loading,
    fetchRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom,
    uploadImage, // Expõe a função de upload para ser usada nos componentes
    deleteImage  // Expõe a função de deletar imagem
  }
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          client:clients(name, email, phone),
          room:rooms(name, price)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching reservations:', error)
      } else {
        setReservations(data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  const createReservation = async (reservationData: Partial<Reservation>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservationData)
        .select()
        .single()

      if (error) {
        console.error('Error creating reservation:', error)
        throw error
      }

      return data
    } catch (err) {
      console.error('Error creating reservation:', err)
      throw err
    }
  }

  const updateReservationStatus = async (
    id: number,
    status: Reservation['status'],
    paymentId?: string
  ) => {
    const updateData: Partial<Reservation> = { status }
    
    if (paymentId) {
      updateData.payment_id = paymentId
    }

    const { data, error } = await supabase
      .from('reservations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating reservation:', error)
      throw error
    }

    return data
  }

  const cancelReservation = async (
    id: number,
    cancellationReason: string,
    cancellationFee: number = 0
  ) => {
    const { data, error } = await supabase
      .from('reservations')
      .update({
        status: 'cancelled',
        cancellation_reason: cancellationReason,
        cancellation_fee: cancellationFee,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error cancelling reservation:', error)
      throw error
    }

    return data
  }

  return {
    reservations,
    loading,
    fetchReservations,
    createReservation,
    updateReservationStatus,
    cancelReservation,
  }
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching clients:', error)
      } else {
        setClients(data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  const getClientReservations = async (clientId: number) => {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        room:rooms(name, price, images)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching client reservations:', error)
      return []
    }

    return data || []
  }

  return {
    clients,
    loading,
    fetchClients,
    getClientReservations,
  }
}

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          reservation:reservations(total_amount, status),
          client:clients(name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching payments:', error)
      } else {
        setPayments(data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  const createPayment = async (paymentData: Partial<Payment>) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single()

      if (error) {
        console.error('Error creating payment:', error)
        throw error
      }

      return data
    } catch (err) {
      console.error('Error creating payment:', err)
      throw err
    }
  }

  const updatePaymentStatus = async (
    id: number,
    status: Payment['status'],
    gatewayResponse?: Record<string, any>
  ) => {
    const updateData: Partial<Payment> = { status }
    
    if (gatewayResponse) {
      updateData.gateway_response = gatewayResponse
    }

    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating payment:', error)
      throw error
    }

    return data
  }

  return {
    payments,
    loading,
    fetchPayments,
    createPayment,
    updatePaymentStatus,
  }
}
