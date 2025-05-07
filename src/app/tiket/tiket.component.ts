// src/app/tiket/tiket.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import printJS from 'print-js';

@Component({
  selector: 'app-tiket',
  templateUrl: './tiket.component.html',
  styleUrls: ['./tiket.component.css']
})
export class TiketComponent {
  @ViewChild('ticketDiv', { static: false }) ticketRef!: ElementRef<HTMLDivElement>;

  private pxToMm(px: number): number {
    return px * 0.264583;
  }

  async generatePdf(): Promise<void> {
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

  printTicket(): void {
    const content = this.ticketDiv.nativeElement.cloneNode(true) as HTMLElement;

    // Abrimos la ventana muy estrecha:
    const printWindow = window.open('', '_blank', 'width=1150,height=800');
    if (!printWindow) return;

    const links = Array.from(document.head.querySelectorAll('link, style'))
      .map(n => n.outerHTML).join('');

    printWindow.document.write(`
                        <html><head>${links}</head><body>
                          <div class="boarding-pass">${content.innerHTML}</div>
                          <script>
                            window.onload = function() {
                              window.print();
                            };
                            // Cuando acabe la impresión, cierra la ventana
                            window.onafterprint = function() {
                              window.close();
                            };
                            // Fallback para navegadores que no soporten onafterprint
                            window.onfocus = function() {
                              // Si vuelve el foco tras imprimir, ciérrala
                              setTimeout(function() { window.close(); }, 200);
                            };
                          </script>
                        </body></html>
                      `);
    printWindow.document.close();
  }





  printTicketf(): void {
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
  
}
