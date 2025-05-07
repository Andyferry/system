import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViajeService } from '../../servicios/ViajeService';
import { RutaService } from '../../servicios/RutaService';
import { HorarioService } from '../../servicios/HorarioService';
import { LanchaService } from '../../servicios/LanchaService';
import { TiketService } from '../../servicios/TiketService';
import { ClienteService } from '../../servicios/ClienteService';
import { Router } from '@angular/router';

interface Viaje {
  id?: number;
  fecha: string;
  id_ruta: number;
  id_horario: number;
  id_lancha: number;
  notas?: string;
  estado: string;
}
interface Ruta { id: number; isla_salida: string; isla_llegada: string; }
interface Horario { id: number; hora_salida: string; notas: string; }
interface Lancha { id: number; nombre: string; capacidad: number; }

interface Tiket {
  id?: number;
  codigo: string;
  equipaje: string;
  extras?: string;
  notas?: string;
  estado: string;
  asientos: number;
  id_viaje: number;
  cliente_cedula: string;
  nombres: string,
  apellidos: string,
}

@Component({
  selector: 'app-viajeprogramado',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './viajeprogramado.component.html',
  styleUrls: ['./viajeprogramado.component.css']
})
export class ViajeprogramadoComponent implements OnInit {
  form: FormGroup;
  viajes: Viaje[] = [];
  rutas: Ruta[] = [];
  horarios: Horario[] = [];
  lanchas: Lancha[] = [];
  rutaMap: Record<number, Ruta> = {};
  horarioMap: Record<number, Horario> = {};
  lanchaMap: Record<number, Lancha> = {};
  editingId: number | null = null;
  searchId: number | null = null;
  loading = false;
  errorMsg = '';
  estados = ['espera', 'lleno', 'zarpado', 'finalizado', 'cancelado'];
  showCreateModal = false;
  tiketForm!: FormGroup;

  pageSize = 20;            // máximo por página
  currentPage = 1;          // página activa
  // Calcula el total de páginas dinámicamente
  get totalPages(): number {
    return Math.ceil(this.viajes.length / this.pageSize) || 1;
  }


  constructor(
    private fb: FormBuilder,
    private viajeService: ViajeService,
    private rutaService: RutaService,
    private horarioService: HorarioService,
    private lanchaService: LanchaService,
    private tiketService: TiketService,
    private clienteSrv: ClienteService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      id_ruta: [null, Validators.required],
      id_horario: [null, Validators.required],
      id_lancha: ['', Validators.required],
      notas: [''],
      estado: ['espera', Validators.required]
    });
  }






 // Devuelve sólo los viajes de la página actual
 get pagedViajes(): Viaje[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.viajes.slice(start, start + this.pageSize);
}
// Navegar a la página anterior
prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
// Navegar a la página siguiente
nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}












  revisaTikets(viajeId: number) {
    // Navega a /tiket/filtroviaje/:id
    this.router.navigate(['/tiketback', 'filtroviaje', viajeId]);
  }













  ngOnInit() {
    this.loadCombos();
    this.loadAll();
  }

  private async loadCombos() {
    this.rutas = await this.rutaService.getRutas();
    this.horarios = await this.horarioService.getHorarios();
    this.lanchas = await this.lanchaService.getLanchas();
    this.rutaMap = Object.fromEntries(this.rutas.map(r => [r.id, r]));
    this.horarioMap = Object.fromEntries(this.horarios.map(h => [h.id, h]));
    this.lanchaMap = Object.fromEntries(this.lanchas.map(l => [l.id, l]));
  }

  async loadAll() {
    this.loading = true;
    this.lanchas = await this.lanchaService.getLanchas();
    this.lanchaMap = this.lanchas.reduce((m, l) => ({ ...m, [l.id]: l }), {});
    this.viajes = (await this.viajeService.getViajes()).map(v => ({
      ...v,
      id_lancha: v.id_lancha != null ? +v.id_lancha : null
    }));
    this.currentPage = 1; 
    this.loading = false;
  }

  async onSubmit() {
    if (this.form.invalid) return;
    const data: Viaje = this.form.value;
    try {
      if (this.editingId != null) {
        await this.viajeService.updateViaje(this.editingId, data);
        if (data.estado === 'finalizado' || data.estado === 'zarpado') {
          await this.tiketService.markTicketsUsedByViaje(this.editingId!);
        }
      } else {
        await this.viajeService.addViaje(data);
      }

      alert('¡Datos guardados con éxito!');


      this.cancelEdit();
      await this.loadAll();
    } catch {
      alert('¡Error guardando viaje.!');

      this.errorMsg = 'Error guardando viaje.';
    }
  }

  async edit(item: Viaje) {

    const lancha = await this.lanchaService.getLanchaById(item.id_lancha!);
    if (!lancha) return;                // no existe, nada que hacer

    // Evita duplicados (opcional)
    const exists = this.lanchas.find(l => l.id === lancha.id);
    if (!exists) {
      this.lanchas.push(lancha);
    }

    this.editingId = item.id!;
    this.form.patchValue(item);


    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async cancelEdit() {
    this.editingId = null;
    this.form.reset({ estado: 'espera' });
    this.lanchas = await this.lanchaService.getLanchasDisponibles();
  }

  async delete(id: number) {
    if (!confirm('¿Eliminar este viaje?')) return;
    await this.viajeService.deleteViaje(id);
    await this.loadAll();
  }
  showInfoModal = false;
  infoData: any = {};

  // Reemplaza tu método info actual por este:
  async info(id: number) {
    // 1) Carga el viaje primero (necesario para conocer IDs relacionados)
    const v = await this.viajeService.getViajeById(id);
    if (!v) return;
  
    // 2) Prepara todas las promesas en paralelo
    const rutaPromise     = this.rutaService.getRutaById(v.id_ruta);
    const horarioPromise  = this.horarioService.getHorarioById(v.id_horario);
    const lanchaPromise   = v.id_lancha 
      ? this.lanchaService.getLanchaById(v.id_lancha) 
      : Promise.resolve(null);
    const ocupadosPromise = this.viajeService.getAsientosOcupados(id);
    const pasajerosPromise= this.tiketService.getPasajerosByViaje(id);
  
    // 3) Espera a que todas terminen
    const [ruta, horario, lancha, ocupados, pasajeros] = await Promise.all([
      rutaPromise,
      horarioPromise,
      lanchaPromise,
      ocupadosPromise,
      pasajerosPromise
    ]);
  
    // 4) Calcula disponibilidad
    const capacidad    = lancha?.capacidad ?? 0;
    const disponibles  = capacidad - ocupados;
    const pct          = capacidad > 0 
      ? Math.round((ocupados / capacidad) * 100) 
      : 0;
  
    // 5) Rellena y muestra
    this.infoData = { v, ruta, horario, lancha, ocupados, disponibles, pct, pasajeros };
    this.showInfoModal = true;
  }
  

  // Y este método para cerrar el modal:
  closeInfoModal() {
    this.showInfoModal = false;
  }




  generarTiket(viajeId: number) {
    // inicializa el formulario con el id de viaje y valores por defecto
    this.tiketForm = this.fb.group({
      codigo: [''],
      equipaje: [''],
      extras: [''],
      notas: [''],
      estado: ['valido', Validators.required],
      asientos: [1, [Validators.required, Validators.min(1)]],
      cliente_cedula: ['', Validators.required],
      nombres: [''],
      apellidos: [''],
      id_viaje: [viajeId, Validators.required]
    });

    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
  }
  // Si no necesitas sobrecargas, declara solo esto:
  async onSubmitTicket(): Promise<void> {
    if (this.tiketForm.invalid) {
      return;
    }
  
    // Desestructuramos y descartamos nombres/apellidos
    const { nombres, apellidos, ...ticketPayload } = this.tiketForm.value;
  
    // Generamos el código sobre el payload limpio
    ticketPayload.codigo = `http://localhost:4200/tiketback/qr/`
      + ticketPayload.cliente_cedula
      + new Date().toISOString();
  
    try {
      // Creamos el ticket sin nombres/apellidos
      await this.tiketService.addTiket(ticketPayload);
      alert('¡Datos guardados con éxito!');
  
      this.closeModal();
      this.loadAll();
    } catch (err) {
      alert('¡Error datos no guardados con éxito!');
      console.error('Error al crear ticket', err);

    }

    let cliente = await this.clienteSrv.getClienteByCedula(this.tiketForm.value.cliente_cedula);
    if (!cliente) {
      // ➕ Crear cliente si no existe
      cliente = await this.clienteSrv.addCliente({
        cedula: this.tiketForm.value.cliente_cedula,
        nombres: this.tiketForm.value.nombres!,
        apellidos: this.tiketForm.value.apellidos!
      });
    }
 


  }



  async onCedulaEnter() {
    const ced = this.tiketForm.get('cliente_cedula')?.value;
    if (!ced) { return; }
    const cli = await this.clienteSrv.getClienteByCedula(ced);
    this.tiketForm.patchValue({
      nombres: cli?.nombres ?? '',
      apellidos: cli?.apellidos ?? ''
    });
  }



  async search() {
    if (!this.searchId) return this.loadAll();
    const v = await this.viajeService.getViajeById(this.searchId);
    this.viajes = v ? [v] : [];
    this.currentPage = 1; 
  }
}
