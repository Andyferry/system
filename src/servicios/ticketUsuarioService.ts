import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environments';
import { SupabaseService } from './Supabase.service'; 

export interface TiketUsuario {
  id_tiket:        number;
  cedula_usuario:  string;
  nombre_usuario:  string;
  apellido_usuario:string;
  equipaje?:       string;
}


@Injectable({
  providedIn: 'root'
})
export class ticketUsuarioService {


  constructor(private supabase: SupabaseService) {  }





  /** Obtiene un único registro de tiket_usuario por su PK `id`. */
  async getById(id: number): Promise<TiketUsuario | null> {
    const { data, error } = await this.supabase.client
      .from('tiket_usuario')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al obtener tiket_usuario id=${id}`, error);
      return null;
    }
    return data;
  }

  /** Lista todos los registros de tiket_usuario para un determinado ticket. */
  async listar(id_tiket: number): Promise<TiketUsuario[]> {
    const { data, error } = await this.supabase.client
      .from('tiket_usuario')
      .select('*')
      .eq('id_tiket', id_tiket);

    if (error) {
      console.error(`Error al listar tiket_usuario para id_tiket=${id_tiket}`, error);
      return [];
    }
    return data ?? [];
  }

  /** Crea un nuevo registro en tiket_usuario. */
  async crear(registro: Omit<TiketUsuario, 'id'>): Promise<TiketUsuario | null> {
    const { data, error } = await this.supabase.client
      .from('tiket_usuario')
      .insert(registro)
      .single();

    if (error) {
      console.error('Error al crear tiket_usuario', error);
      return null;
    }
    return data;
  }

  /** Actualiza un registro existente de tiket_usuario por su PK `id`. */
  async actualizar(id: number, cambios: Partial<TiketUsuario>): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('tiket_usuario')
      .update(cambios)
      .eq('id', id);

    if (error) {
      console.error(`Error al actualizar tiket_usuario id=${id}`, error);
      return false;
    }
    return true;
  }

  /** Inserta o actualiza en bloque registros de tiket_usuario (upsert). */
  /**
  * Inserta o actualiza en bloque registros de tiket_usuario (upsert)
  * Utiliza la clave compuesta (id_tiket, cedula_usuario) para ON CONFLICT
  */
  /**
    * Inserta o actualiza en bloque registros de tiket_usuario (upsert)
    * Utiliza la clave compuesta (id_tiket, cedula_usuario) para ON CONFLICT
    */
  async guardarBulk(
    id_tiket: number,
    registros: TiketUsuario[]
  ): Promise<boolean> {
    // Asegúrate de que cada objeto ya incluya id_tiket y cedula_usuario
    const payload = registros.map(r => ({ ...r, id_tiket }));

    const { error } = await this.supabase.client
      .from('tiket_usuario')
      .upsert(payload, { onConflict: 'id_tiket,cedula_usuario' });

    if (error) {
      console.error(
        `Error al upsert bulk tiket_usuario para id_tiket=${id_tiket}`,
        error
      );
      return false;
    }

    return true;
  }

  /** Elimina un registro de tiket_usuario según id_tiket y cedula_usuario. */
  async eliminar(id_tiket: number, cedula_usuario: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('tiket_usuario')
      .delete()
      .eq('id_tiket', id_tiket)
      .eq('cedula_usuario', cedula_usuario);

    if (error) {
      console.error(`Error al eliminar tiket_usuario cedula_usuario=${cedula_usuario} para id_tiket=${id_tiket}`, error);
      return false;
    }
    return true;
  }























}
