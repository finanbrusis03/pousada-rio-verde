import { supabase } from './supabase'

export const uploadImage = async (file: File, folder = 'rooms'): Promise<string> => {
  try {
    // Gera um nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    
    // Faz o upload para o bucket 'images' no Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      throw error
    }

    // Obtém a URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Error in uploadImage:', error)
    throw error
  }
}

export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extrai o caminho do arquivo da URL
    const path = url.split('/').slice(-2).join('/')
    
    const { error } = await supabase.storage
      .from('images')
      .remove([path])

    if (error) {
      console.error('Error deleting image:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteImage:', error)
    return false
  }
}
