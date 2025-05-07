import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutaService } from '../../servicios/RutaService'; 

interface Ruta {
  id?: number;
  isla_salida: string;
  isla_llegada: string;
  notas?: string;
  estado: boolean;
  siglassal?: string;
  siglaslleg?: string;
}

@Component({
  selector: 'app-ruta',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.css']
})
export class RutaComponent implements OnInit {
  form: FormGroup;
  rutas: Ruta[] = [];
  editingId: number | null = null;
  searchId: number | null = null;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private rutaService: RutaService
  ) {
    this.form = this.fb.group({
      isla_salida:   ['', Validators.required],
      isla_llegada:  ['', Validators.required],
      notas:         [''],
      estado:        [true],
      siglassal:         [''],
      siglaslleg:         [''],
    });
  }

  ngOnInit() {
    this.loadAll();
  }

  async loadAll() {
    this.loading = true;
    this.rutas = await this.rutaService.getRutas();
    this.loading = false;
  }

  async onSubmit() {
    if (this.form.invalid) return;
    const data: Ruta = this.form.value;

    try {
      if (this.editingId != null) {
        await this.rutaService.updateRuta(this.editingId, data);
      } else {
        await this.rutaService.addRuta(data);
      }
      this.cancelEdit();
      await this.loadAll();
    } catch (err) {
      console.error(err);
      this.errorMsg = 'Error guardando ruta.';
    }
  }

  edit(item: Ruta) {
    this.editingId = item.id!;
    this.form.patchValue(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ estado: true });
  }

  async delete(id: number) {
    if (!confirm('¿Eliminar esta ruta?')) return;
    await this.rutaService.deleteRuta(id);
    await this.loadAll();
  }

  async search() {
    if (!this.searchId) return this.loadAll();
    const r = await this.rutaService.getRutaById(this.searchId);
    this.rutas = r ? [r] : [];
  }
}
