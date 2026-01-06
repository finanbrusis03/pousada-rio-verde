import { supabase } from './supabase'

interface UploadResponse {
  path: string;
  fullPath: string;
  id: string;
}

export const uploadImage = async (file: File, folder = 'rooms'): Promise<string> => {
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file provided')
  }

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

    if (error || !data) {
      console.error('Error uploading image:', error)
      throw error || new Error('Failed to upload image')
    }

    // Obtém a URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path)

    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded image')
    }

    return publicUrl
  } catch (error) {
    console.error('Error in uploadImage:', error)
    throw error instanceof Error ? error : new Error('Failed to upload image')
  }
}

export const deleteImage = async (url: string): Promise<boolean> => {
  if (!url) {
    console.warn('No URL provided for image deletion')
    return false
  }

  try {
    // Extrai o caminho do arquivo da URL
    const urlParts = url.split('/')
    if (urlParts.length < 2) {
      throw new Error('Invalid image URL format')
    }
    
    const path = urlParts.slice(-2).join('/')
    
    const { error } = await supabase.storage
      .from('images')
      .remove([path])

    if (error) {
      console.error('Error deleting image:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteImage:', error)
    return false
  }
}
