import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanchaService } from '../../servicios/LanchaService';  

interface Lancha {
  id?: number;
  nombre: string;
  capacidad: number;
  detalles?: string;
  estado: string;
}

@Component({
  selector: 'app-lancha',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './lancha.component.html',
  styleUrls: ['./lancha.component.css']
})
export class LanchaComponent implements OnInit {
  form: FormGroup;
  lanchas: Lancha[] = [];
  editingId: number | null = null;
  searchId: number | null = null;
  loading = false;
  errorMsg = '';

  estados = ['disponible', 'ocupado', 'mantenimiento'];
  pageSize = 20;
currentPage = 1;

get totalPages(): number {
  return Math.max(1, Math.ceil(this.lanchas.length / this.pageSize));
}

get pagedLanchas(): Lancha[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.lanchas.slice(start, start + this.pageSize);
}

prevPage(): void {
  if (this.currentPage > 1) this.currentPage--;
}

nextPage(): void {
  if (this.currentPage < this.totalPages) this.currentPage++;
}

  constructor(
    private fb: FormBuilder,
    private lanchaService: LanchaService
  ) {
    this.form = this.fb.group({
      nombre:    ['', Validators.required],
      capacidad: [1, [Validators.required, Validators.min(1)]],
      detalles:  [''],
      estado:    ['disponible', Validators.required]
    });
  }

  ngOnInit() {
    this.loadAll();
  }

  async loadAll() {
    this.loading = true;
    this.lanchas = await this.lanchaService.getLanchas();
    this.currentPage = 1;
    this.loading = false;
  }

  async onSubmit() {
    if (this.form.invalid) return;
    const data: Lancha = this.form.value;

    try {
      if (this.editingId != null) {
        await this.lanchaService.updateLancha(this.editingId, data);
      } else {
        await this.lanchaService.addLancha(data);
      }
      this.cancelEdit();
      await this.loadAll();
    } catch (err) {
      console.error(err);
      this.errorMsg = 'Error guardando lancha.';
    }
  }

  edit(item: Lancha) {
    this.editingId = item.id!;
    this.form.patchValue(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ estado: 'disponible', capacidad: 1 });
  }

  async delete(id: number) {
    if (!confirm('¿Eliminar esta lancha?')) return;
    await this.lanchaService.deleteLancha(id);
    await this.loadAll();
  }

  async search() {
    if (!this.searchId) return this.loadAll();
    const l = await this.lanchaService.getLanchaById(this.searchId);
    this.lanchas = l ? [l] : [];
    this.currentPage = 1;
  }
}
