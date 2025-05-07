import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ClienteService } from '../../servicios/ClienteService';  
import { ViajeService } from '../../servicios/ViajeService';  
import { RutaService } from '../../servicios/RutaService';  
import { HorarioService } from '../../servicios/HorarioService';  
import { LanchaService } from '../../servicios/LanchaService';  
import { TiketService } from '../../servicios/TiketService';  
import { ticketUsuarioService, TiketUsuario as Pasajero } from '../../servicios/ticketUsuarioService';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import printJS from 'print-js';


interface ViajeParams {
  fecha: string;
  id_ruta: number;
  id_horario: number;
  id_lancha?: number | null;
}
interface Cliente {
  id?: number;
  cedula: string;
  nombres: string;
  apellidos: string;
}

interface Viaje {
  id?: number;
  fecha: string;
  id_ruta: number;
  id_horario: number;
  id_lancha?: number;
}

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
}


export interface TiketPasajero {
  cedula_usuario:   string;
  nombre_usuario:   string;
  apellido_usuario: string;
  equipaje?:        string;
}










@Component({
  selector: 'app-tiketback',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tiketback.component.html',
  styleUrls: ['./tiketback.component.css'],
})
export class TiketbackComponent implements OnInit {
 @ViewChild('ticketDiv', { static: false }) ticketRef!: ElementRef<HTMLDivElement>;

  private pxToMm(px: number): number {
    return px * 0.264583;
  }



  async generatePdf(idd:number): Promise<void> {
    const element = this.ticketRef.nativeElement;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: false });
    const imgData = canvas.toDataURL('image/png');
    const mmHeight = this.pxToMm(canvas.height);

    const pdf = new jsPDF({ unit: 'mm', format: [80, mmHeight], orientation: 'portrait' });
    pdf.addImage(imgData, 'PNG', 0, 0, 80, mmHeight);
    pdf.save('ticket.pdf');
  }



  // … tu generatePdf()
  async printPdf(): Promise<void> {
    const el: HTMLElement = this.ticketRef.nativeElement;

    // 1) Captura con html2canvas
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      width: el.scrollWidth,
      height: el.scrollHeight,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight
    });

    // 2) Imagen y mmHeight
    const imgData = canvas.toDataURL('image/png');
    const mmHeight = this.pxToMm(canvas.height);

    // 3) Creo PDF
    const pdf = new jsPDF({
      unit: 'mm',
      format: [80, mmHeight],
      orientation: 'portrait'
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 80, mmHeight);
    pdf.autoPrint();

    // 4) Saco un Blob URL
    const blobUrl = pdf.output('bloburl');

    // 5) Abro la ventana
    const win = window.open(blobUrl, '_blank');
    if (!win) {
      console.error('¡Pop-ups bloqueados?');
      return;
    }

    // 6) Espero a que cargue y hago print()
    win.addEventListener('load', () => {
      win.print();
      // opcional: win.close();
    });
  }



  // Tu método printTicket() sin cambiar HTML
  @ViewChild('ticketDiv') ticketDiv!: ElementRef;
  printTicket(idd: number): void {
    const content = this.ticketDiv.nativeElement.cloneNode(true) as HTMLElement;
  
    // 1) Abrimos sin forzar tamaño
    const printWindow = window.open(
      '',
      '_blank',
      'toolbar=0,location=0,menubar=0,scrollbars=1'
    );
    if (!printWindow) return;
  
    // 2) La movemos y redimensionamos para cubrir toda la pantalla
    printWindow.moveTo(0, 0);
    printWindow.resizeTo(screen.availWidth, screen.availHeight);
  
    // 3) Clonamos estilos y contenido
    const links = Array.from(document.head.querySelectorAll('link, style'))
      .map(n => n.outerHTML)
      .join('');
    const printStyles = `
      <style>
        @page { size: 80mm auto; margin: 0 }
        body, html { margin:0; padding:0; width:80mm }
        .boarding-pass {
          width:80mm; box-sizing:border-box; padding:2mm;
          font-family:monospace; font-size:12px;
        }
      </style>
    `;
  
    printWindow.document.write(`
      <html><head>
        ${links}
        ${printStyles}
      </head>
      <body>
        <div class="boarding-pass">${content.innerHTML}</div>
        <script>
          window.onload = () => window.print();
          window.onafterprint = () => window.close();
          window.onfocus = () => setTimeout(() => window.close(), 200);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
  


  printTicketf(idd:number): void {
    // 1) Añade la clase al <body>
    document.body.classList.add('print-mode');
  
    // 2) Al terminar la impresión, quítala
    window.onafterprint = () => {
      document.body.classList.remove('print-mode');
      window.onafterprint = null;
    };
    window.onfocus = () => {
      setTimeout(() => {
        document.body.classList.remove('print-mode');
        window.onfocus = null;
      }, 200);
    };
  
    // 3) Lanza el diálogo
    window.print();
  }
  






























  idViaje!: number;
  loading = true;
  errorMsg = '';


// ─── PAGINACIÓN ───────────────────────────
pageSize = 20;
currentPage = 1;
get totalPages(): number {
  return Math.ceil(this.tikets.length / this.pageSize) || 1;
}
get pagedTikets(): Tiket[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.tikets.slice(start, start + this.pageSize);
}
prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}



  ticketIdSeleccionado: number | null = null;
  mostrarFormularioPasajero = false;
  
  formViajeros: FormGroup;



  form: FormGroup;

  rutas: any[] = [];
  horarios: any[] = [];
  lanchas: any[] = [];
  tikets: any[] = [];

  searchId = '';;
  searchCedula = '';
  editingId: number | null = null;
  loadingForm = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clienteSrv: ClienteService,
    private viajeSrv: ViajeService,
    private rutaSrv: RutaService,
    private horarioSrv: HorarioService,
    private lanchaSrv: LanchaService,
    private tiketSrv: TiketService,
    private ticketUsuarioService: ticketUsuarioService
  ) {
    this.formViajeros = this.fb.group({
      tiket_usuario: this.fb.array([])
    });




    this.form = this.fb.group({
      cliente_cedula: ['', Validators.required],
      nombres: [''],
      apellidos: [''],
      fecha: ['', Validators.required],
      id_ruta: [null, Validators.required],
      id_horario: [null, Validators.required],
      id_lancha: [null],
      asientos: [1, [Validators.required, Validators.min(1)]],
      equipaje: [''],
      extras: [''],
      notas: [''],
      estado: ['valido', Validators.required],
    });
  }








  get tiketUsuarioFA(): FormArray {
    return this.formViajeros.get('tiket_usuario') as FormArray;
  }
  
  async agregarpasajero(ticketId: number) {
    this.ticketIdSeleccionado = ticketId;
    this.mostrarFormularioPasajero = true;
    this.tiketUsuarioFA.clear();
  
    const registros = await this.ticketUsuarioService.listar(ticketId);
    registros.forEach(p => {
      this.tiketUsuarioFA.push(this.fb.group({
        cedula_usuario:   [p.cedula_usuario,   Validators.required],
        nombre_usuario:   [p.nombre_usuario,   Validators.required],  // viene de la tabla intermedia
        apellido_usuario: [p.apellido_usuario, Validators.required],  // idem
        equipaje:         [p.equipaje || '']
      }));
    });
  }
  
  
  
  // 2) Agregar una nueva fila al FormArray
  addPasajero(): void {
    this.tiketUsuarioFA.push(this.fb.group({
      cedula_usuario:   ['', Validators.required],
      nombre_usuario:   ['', Validators.required],
      apellido_usuario: ['', Validators.required],
      equipaje:         ['']
    }));
  }
  
  
  // 3) Eliminar un pasajero (usa Observable<boolean>)
  async removePasajero(index: number): Promise<void> {
    const pasajero = this.tiketUsuarioFA.at(index).value as Pasajero;
    if (pasajero.id_tiket !== null && this.ticketIdSeleccionado !== null) {
      try {
        const ok = await this.ticketUsuarioService.eliminar(
          this.ticketIdSeleccionado,
          pasajero.cedula_usuario
        );
        if (ok) {
          this.tiketUsuarioFA.removeAt(index);
          alert('¡Eliminado con éxito!');
        } else {
          alert('¡No fue eliminado con éxito!');
          console.error('No se pudo eliminar el pasajero en BD');
        }
        

      } catch (err) {
        alert('¡Error al eliminar pasajero!');

        console.error('Error al eliminar pasajero:', err);
      }
    } else {
      this.tiketUsuarioFA.removeAt(index);
    }
  }
  // 4) Guardar todos los cambios en bulk (upsert)
  async guardarPasajeros(): Promise<void> {
    try {
      const payload = this.tiketUsuarioFA.value as Pasajero[];
      const ok = await this.ticketUsuarioService.guardarBulk(this.ticketIdSeleccionado!, payload);
      if (ok) {
        this.mostrarFormularioPasajero = false;
      }
      alert('¡Exito al guardar pasajeros!');
    } catch (err) {
      alert('¡Error al guardar pasajeros!');
      console.error('Error al guardar pasajeros', err);
    }
  }
  
  cancelarFormulario() {
    this.mostrarFormularioPasajero = false;
  }




















  async onCedulaEnter() {
    const ced = this.form.get('cliente_cedula')!.value;
    const cli = await this.clienteSrv.getClienteByCedula(ced);
  
    this.form.patchValue({
      nombres:   cli?.nombres   ?? '',
      apellidos: cli?.apellidos ?? ''
      // …otros controles
    });
  }
  
  
  async ngOnInit() {
    this.rutas = await this.rutaSrv.getRutas();
    this.horarios = await this.horarioSrv.getHorarios();
    this.lanchas = await this.lanchaSrv.getLanchasDisponibles();
    
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.idViaje = +idStr;
        this.loadTicketsByViaje(this.idViaje);
      } else {
        this.loading = false;
        this.errorMsg = 'No se recibió un ID de viaje.';
        this.loadList();
      }
    });
  }





  private async loadTicketsByViaje(id: number) {
    try {
      // Asegúrate de que tu servicio tenga este método:
      this.tikets = await this.tiketSrv.getTiketsByViaje(id);
      this.currentPage = 1; 
    } catch (err) {
      console.error(err);
      this.errorMsg = 'Error al cargar tickets.';
    } finally {
      this.loading = false;
    }
  }






  async loadList() {
    this.tikets = await this.tiketSrv.getTikets();
    this.currentPage = 1; 
  }



  async saveTiket(op:number) {
    if (this.form.invalid) return;
    this.loadingForm = true;
  
    const val = this.form.value;
  
    // 🔍 Buscar cliente por cédula
    let cliente = await this.clienteSrv.getClienteByCedula(val.cliente_cedula);
    if (!cliente) {
      // ➕ Crear cliente si no existe
      cliente = await this.clienteSrv.addCliente({
        cedula: val.cliente_cedula,
        nombres: val.nombres!,
        apellidos: val.apellidos!
      });
    }
  
    // 📅 Buscar o crear viaje en espera
    const params: Viaje = {
      fecha: val.fecha,
      id_ruta: val.id_ruta,
      id_horario: val.id_horario,
      id_lancha: val.id_lancha
    };
  
    let viaje = await this.viajeSrv.findViajeEspera(params);
  
    if (!viaje) {
      await this.viajeSrv.addViajex(params);
      viaje = await this.viajeSrv.getUltimoViaje(); // ⬅️ Aquí recuperas el último creado
    }
  
    const idvi = viaje?.id;
    if (!idvi) {
      console.error('No se pudo obtener el ID del viaje');
      this.loadingForm = false;
      return;
    }
  
    // 🎫 Crear ticket
    await this.tiketSrv.addTiket({
      codigo: `http://localhost:4200/tiketback/qr/${val.cliente_cedula}${new Date().toISOString()}`,
      equipaje: val.equipaje,
      extras: val.extras,
      notas: val.notas,
      estado: val.estado,
      asientos: val.asientos,
      id_viaje: idvi,
      cliente_cedula: val.cliente_cedula
    });
    alert('¡Datos guardados con éxito!');
    if (op === 2) {
      this.printTicketf(2);
    }else if (op === 3) {
      this.generatePdf(1);
    }



  
    // ✅ Reset y recarga
    this.loadingForm = false;
    this.form.reset({
      equipaje: 'ninguno',
      estado: 'valido',
      asientos: 1
    });
    this.loadList();
  }









  async search() {
    this.loading = true;
    const t = await this.tiketSrv.getTiketById(+this.searchId);
    this.tikets = t ? [t] : [];
    this.currentPage = 1;
    this.loading = false;
  }


  async searchcedula() {
    if (this.searchId === null) return this.loadList();
  
    console.log('Valor de this.searchId:', this.searchId);
  
    const t = await this.tiketSrv.getTiketsByCedula(this.searchId);
    this.tikets = t ?? []; 
    this.currentPage = 1;  // resetea al buscar
    // usa directamente t como array
  }

  async edit(item: Tiket) {
    this.loadingForm = true;
    this.editingId = item.id!;
  
    // 1) Datos básicos del ticket
    const ticketData = {
      cliente_cedula: item.cliente_cedula,
      asientos:       item.asientos,
      equipaje:       item.equipaje,
      extras:         item.extras,
      notas:          item.notas,
      estado:         item.estado
    };
  
    // 2) Carga el viaje asociado
    const viaje = await this.viajeSrv.getViajeById(item.id_viaje);
    const viajeData = viaje ? {
      fecha:      viaje.fecha,
      id_ruta:    viaje.id_ruta,
      id_horario: viaje.id_horario,
      id_lancha:  viaje.id_lancha
    } : {};
  
    // 3) Carga datos del cliente por cédula
    const cli = await this.clienteSrv.getClienteByCedula(item.cliente_cedula);
    const clienteData = cli ? {
      nombres:   cli.nombres,
      apellidos: cli.apellidos
    } : { nombres: '', apellidos: '' };
  
    // 4) Parchea el form con todos los datos
    this.form.patchValue({
      ...viajeData,
      ...ticketData,
      ...clienteData
    });
  
    this.loadingForm = false;
  }

  async delete(id: number) {
    if (!confirm('¿Eliminar este ticket?')) return;
    await this.tiketSrv.deleteTiket(id);
    this.loadList();
  }















}