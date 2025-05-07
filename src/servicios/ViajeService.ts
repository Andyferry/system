import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environments';
import { SupabaseService } from './Supabase.service'; 



export interface ViajeParams {
  fecha: string;
  id_ruta: number;
  id_horario: number;
  id_lancha?: number | null;
}
@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  constructor(private supabase: SupabaseService) {  }





  async getViajes(): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('viaje_programado')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error al obtener Viajes', error);
      return [];
    }
    return data as any[];
  }

  async getViajeById(id: number): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('viaje_programado')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al buscar viaje id=${id}`, error);
      return null;
    }
    return data;
  }











 // ← Nuevo: busca un viaje en estado 'espera' con estos parámetros
 async findViajeEspera(params: ViajeParams): Promise<any|null> {
  const { data, error } = await this.supabase.client
    .from('viaje_programado')
    .select('*')
    .eq('fecha', params.fecha)
    .eq('id_ruta', params.id_ruta)
    .eq('id_horario', params.id_horario)
    .eq('id_lancha', params.id_lancha ?? null)
    .eq('estado', 'espera')
    .single();
  if (error) return null;
  return data;
}

// ← Nuevo: crea un viaje con estos parámetros
async addViajex(params: ViajeParams): Promise<any> {
  const { data, error } = await this.supabase.client
    .from('viaje_programado')
    .insert(params)
    .single();
  if (error) throw error;
  return data!;
}

// En viaje.service.ts
async getUltimoViaje(): Promise<any | null> {
  const { data, error } = await this.supabase.client
    .from('viaje_programado')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error al obtener el último viaje', error);
    return null;
  }

  return data;
}




async getAsientosOcupados(idViaje: number): Promise<number> {
  // 1) Trae solo el campo "asientos" de los tickets de ese viaje
  const { data, error } = await this.supabase.client
    .from('tiket')
    .select('asientos')
    .eq('id_viaje', idViaje);

  if (error) {
    console.error(`Error al obtener tickets para viaje ${idViaje}`, error);
    return 0;
  }
  
  // 2) Suma todos los asientos (data es any[] con objetos { asientos: number })
  const total = (data ?? []).reduce((sum, row) => sum + (row.asientos ?? 0), 0);

  return total;
}













  // ➕ Crear nuevo viaje
  async addViaje(viaje: Omit<any, 'id'>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('viaje_programado')
      .insert(viaje)
      .single();

    if (error) {
      console.error('Error al crear viaje', error);
      return null;
    }
    return data;
  }

 
  async updateViaje(id: number, cambios: Partial<any>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('viaje_programado')
      .update(cambios)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al actualizar viaje id=${id}`, error);
      return null;
    }
    return data;
  }

  // ❌ Eliminar viaje
  async deleteViaje(id: number): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('viaje_programado')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error al eliminar viaje id=${id}`, error);
      return false;
    }
    return true;
  }



}
