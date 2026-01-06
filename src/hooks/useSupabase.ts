import { useState, useEffect } from 'react'
import { supabase, Database } from '@/lib/supabase'
import type { Room, Reservation, Client, Payment } from '@/lib/supabase'

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

  const createRoom = async (room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert(room)
        .select()
        .single()

      if (error) {
        console.error('Error creating room:', error)
        throw error
      }

      await fetchRooms()
      return data
    } catch (err) {
      console.error('Error creating room:', err)
      throw err
    }
  }

  const updateRoom = async (id: string, room: Partial<Room>) => {
    try {
      console.log('Updating room:', id, room)
      
      const { data, error } = await supabase
        .from('rooms')
        .update(room)
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating room:', error)
        throw error
      }

      if (!data || data.length === 0) {
        console.error('No room found with id:', id)
        throw new Error('Quarto não encontrado')
      }

      await fetchRooms()
      return data[0]
    } catch (err) {
      console.error('Error updating room:', err)
      throw err
    }
  }

  const deleteRoom = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting room:', error)
        throw error
      }

      await fetchRooms()
      return true
    } catch (err) {
      console.error('Error deleting room:', err)
      throw err
    }
  }

  const getRoom = async (id: number) => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching room:', error)
      return null
    }

    return data
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

  return {
    rooms,
    loading,
    fetchRooms,
    getRoom,
    checkAvailability,
    createRoom,
    updateRoom,
    deleteRoom,
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
