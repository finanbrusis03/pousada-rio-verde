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

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching rooms:', error)
        throw error
      }
      
      const processedRooms = (data || []).map(room => ({
        ...room,
        images: Array.isArray(room.images) ? room.images : [],
        amenities: Array.isArray(room.amenities) ? room.amenities : [],
        features: Array.isArray(room.features) ? room.features : [],
        status: room.status || 'available',
        min_nights: room.min_nights || 1
      }))
      
      setRooms(processedRooms)
      return processedRooms
    } catch (error) {
      console.error('Error in fetchRooms:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const createRoom = async (roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Garante que os dados estejam no formato correto
      const roomToCreate = {
        ...roomData,
        images: Array.isArray(roomData.images) ? roomData.images : [],
        amenities: Array.isArray(roomData.amenities) ? roomData.amenities : [],
        features: Array.isArray(roomData.features) ? roomData.features : [],
        status: roomData.status || 'available',
        min_nights: roomData.min_nights || 1,
        price: Number(roomData.price) || 0,
        capacity: Number(roomData.capacity) || 1
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

  const updateRoom = async (id: string, updates: Partial<Omit<Room, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      console.log('Iniciando atualização do quarto ID:', id);
      console.log('Dados recebidos para atualização:', updates);
      
      if (!id) {
        throw new Error('ID do quarto não fornecido');
      }

      // Verifica se o usuário está autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Erro ao verificar autenticação:', userError);
        
        // Tenta obter a sessão atual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Nenhuma sessão ativa encontrada');
          // Redireciona para a página de login
          window.location.href = '/admin/login';
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
        
        // Se chegou aqui, temos uma sessão, mas getUser falhou
        // Vamos tentar atualizar o token manualmente
        const { data: { session: refreshedSession }, error: refreshError } = 
          await supabase.auth.refreshSession();
          
        if (refreshError || !refreshedSession) {
          console.error('Erro ao atualizar a sessão:', refreshError);
          window.location.href = '/admin/login';
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
      }

      console.log('Usuário autenticado:', user?.email || 'Usuário não identificado');
      console.log('Iniciando atualização do quarto ID:', id);
      console.log('Dados recebidos para atualização:', updates);
      
      // Verifica se o ID é válido
      if (!id) {
        throw new Error('ID do quarto não fornecido');
      }

      // Converte o ID para string para garantir consistência
      const roomId = String(id);
      
      console.log('Buscando quarto com ID:', roomId);
      
      // Primeiro, obtém o quarto existente usando o operador de igualdade para UUID
      const { data: existingRooms, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId);

      if (fetchError || !existingRooms || existingRooms.length === 0) {
        console.error('Quarto não encontrado. ID:', roomId, 'Erro:', fetchError);
        throw new Error(`Quarto não encontrado com o ID: ${roomId}`);
      }
      
      const existingRoom = existingRooms[0];
      console.log('Quarto encontrado:', existingRoom);

      // Prepara os dados para atualização, mantendo os valores existentes para campos não fornecidos
      const roomToUpdate: any = {
        name: updates.name ?? existingRoom.name,
        description: updates.description ?? existingRoom.description,
        capacity: updates.capacity !== undefined ? Number(updates.capacity) : existingRoom.capacity,
        price: updates.price !== undefined ? Number(updates.price) : existingRoom.price,
        size: updates.size ?? existingRoom.size,
        beds: updates.beds ?? existingRoom.beds,
        status: updates.status ?? existingRoom.status,
        min_nights: updates.min_nights !== undefined ? Number(updates.min_nights) : existingRoom.min_nights,
        updated_at: new Date().toISOString(),
      };

      // Trata os arrays separadamente para garantir que sejam sempre arrays
      roomToUpdate.images = Array.isArray(updates.images) ? updates.images : 
                           (Array.isArray(existingRoom.images) ? existingRoom.images : []);
      
      roomToUpdate.amenities = Array.isArray(updates.amenities) ? updates.amenities : 
                             (Array.isArray(existingRoom.amenities) ? existingRoom.amenities : []);
      
      roomToUpdate.features = Array.isArray(updates.features) ? updates.features : 
                            (Array.isArray(existingRoom.features) ? existingRoom.features : []);

      console.log('Dados que serão enviados para atualização:', JSON.stringify(roomToUpdate, null, 2));

      console.log('Enviando atualização para o quarto ID:', roomId);
      console.log('Dados da atualização:', roomToUpdate);
      
      console.log('Tentando atualizar quarto com ID (tipo):', roomId, typeof roomId);
      
      // Faz o update usando o operador de igualdade para UUID
      const { data: updatedData, error: updateError } = await supabase
        .from('rooms')
        .update(roomToUpdate)
        .eq('id', roomId)
        .select()
        .single();
        
      console.log('Resposta do update:', { updatedData, updateError });
      
      if (updateError) {
        console.error('Erro ao atualizar quarto:', updateError);
        throw updateError;
      }
        
      if (updateError) {
        console.error('Erro na operação de update:', updateError);
        throw updateError;
      }
      
      // Busca o registro atualizado usando o operador de igualdade para UUID
      const { data: updatedRoom, error: fetchUpdatedError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();  // Usamos single() pois o registro deve existir após a atualização
        
      if (fetchUpdatedError) {
        console.error('Erro ao buscar quarto atualizado:', fetchUpdatedError);
        // Mesmo com erro, tentamos atualizar a lista local
        await fetchRooms();
        throw fetchUpdatedError;
      }

      if (!updatedRoom) {
        console.error('Nenhum dado retornado ao buscar o quarto atualizado');
        // Mesmo sem dados, tentamos atualizar a lista local
        await fetchRooms();
        throw new Error('Não foi possível confirmar a atualização do quarto');
      }
      
      console.log('Quarto atualizado com sucesso:', updatedRoom);
      
      // Atualiza a lista de quartos para refletir as mudanças
      await fetchRooms();
      
      // Retorna os dados atualizados do banco de dados
      return updatedRoom;
    } catch (error) {
      console.error('Error updating room:', error);
      throw new Error(`Erro ao atualizar o quarto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  const deleteRoom = async (id: string | number) => {
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

  const getRoom = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) throw new Error('Quarto não encontrado')

      // Processa os dados para garantir o formato correto
      return {
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        features: Array.isArray(data.features) ? data.features : []
      }
    } catch (error) {
      console.error('Error getting room:', error)
      throw error
    }
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
