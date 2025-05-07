import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environments';
import { SupabaseService } from './Supabase.service'; 
export interface TiketUsuario {
  id?: number;
  id_tiket: number;
  cedula_usuario: string;
  equipaje?: string;
}


@Injectable({
  providedIn: 'root'
})
export class TiketService {

  constructor(private supabase: SupabaseService) {  }



  async getTikets(): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('tiket')
      .select('*')
      .order('id', { ascending: false }); // 👈 Orden descendente directamente desde Supabase
  
    if (error) {
      console.error('Error al obtener tikets', error);
      return [];
    }
    return data || [];
  }
  
  // 🔍 Buscar tiket por ID
  async getTiketById(id: number): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('tiket')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al buscar tiket id=${id}`, error);
      return null;
    }
    return data;
  }





























  
  async getTiketsByViaje(id_viaje: number): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('tiket')
      .select('*')
      .eq('id_viaje', id_viaje);
  
    if (error) {
      console.error(`Error al buscar tickets para viaje id=${id_viaje}`, error);
      return [];
    }
    return data;
  }

  async getTiketsByCedula(cedula: string): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('tiket')
      .select('*')
      .eq('cliente_cedula', cedula);
  
    if (error) {
      console.error(`Error al buscar tickets para cliente cedula=${cedula}`, error);
      return [];
    }
    return data;
  }




  // ➕ Crear nuevo tiket
  async addTiket(tiket: Omit<any, 'id'>): Promise<any | null> {
    
    const { data, error } = await this.supabase.client
      .from('tiket')
      .insert(tiket)
      .single();

    if (error) {
      console.error('Error al crear tiket', error);
      return null;
    }
    return data;
  }

  // ✏️ Actualizar tiket existente
  async updateTiket(id: number, cambios: Partial<any>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('tiket')
      .update(cambios)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al actualizar tiket id=${id}`, error);
      return null;
    }
    return data;
  }


  async markTicketsUsedByViaje(idViaje: number): Promise<any[] | null> {
    // Actualiza todos los tickets cuyo id_viaje coincida, poniendo estado = 'usado'
    const { data, error } = await this.supabase.client
      .from('tiket')
      .update({ estado: 'usado' })
      .eq('id_viaje', idViaje);
  
    if (error) {
      console.error(`Error al marcar tickets de viaje ${idViaje} como usados`, error);
      return null;
    }
  
    // data es el array de tickets que fueron actualizados
    return data;
  }
  
  

  async getPasajerosByViaje(id_viaje: number): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .rpc('get_pasajeros_con_datos', { id_viaje_input: id_viaje });
  
    if (error) {
      console.error('Error ejecutando función RPC:', error);
      return [];
    }
  
    return data || [];
  }






  
  // ❌ Eliminar tiket
  async deleteTiket(id: number): Promise<boolean> {
    // Primero eliminar los registros relacionados en la tabla intermedia
    const { error: intermediaError } = await this.supabase.client
      .from('tiket_usuario') // Cambia esto por el nombre de tu tabla intermedia
      .delete()
      .eq('id_tiket', id);
  
    if (intermediaError) {
      console.error(`Error al eliminar registros en la tabla intermedia para el tiket id=${id}`, intermediaError);
      return false;
    }
  
    // Luego eliminar el tiket
    const { error } = await this.supabase.client
      .from('tiket')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error(`Error al eliminar tiket id=${id}`, error);
      return false;
    }
  
    return true;
  }



}
