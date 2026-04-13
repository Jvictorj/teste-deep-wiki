import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective } from 'ngx-mask';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { frontZapFarmaHeaderComponent } from 'src/app/shared/header/header.component';
import { frontZapFarmaMenuComponent } from 'src/app/shared/menu/menu.component';
import { GoogleMapsModule } from "@angular/google-maps";
import { CepsService } from 'src/app/services/ceps/ceps.service';


@Component({
  selector: 'front-zapfarma-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule, 
    frontZapFarmaMenuComponent, 
    frontZapFarmaHeaderComponent, 
    ReactiveFormsModule, 
    NgxMaskDirective, 
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    GoogleMapsModule
  ],
  providers: [CepsService]
})
export class MapsComponent implements OnInit {
  usuario:any;
  options: google.maps.MapOptions = {
    mapId: "aa9fe419627634d5",
    center: { lat: -22.9035, lng: -43.2096 },
    zoom: 10,
  };
  nzLocations: any[] = [
    { lat: -22.9639544, lng: -43.6061593 }
  ];

  pinBackground: any;
  


  constructor(
    private _usuariosService: UsuariosService,
    private _cepsService: CepsService
  ) {
    this.usuario = this._usuariosService.obterUsuarioLogado;
   }

  ngOnInit() {
    this.consutarEndereco();
  }

  consutarEndereco() {
      this._cepsService.consultarFamraciasAfiliadas().subscribe((response: any) => {
        this.nzLocations = response.result;
        this.initMap(this.nzLocations);
      });
    }
  
  async initMap(properties:any) {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const center = {lat: -22.9035, lng: -43.2096};
    const map = new Map(document.getElementById("mapGoogle") as HTMLElement, {
    zoom: 11,
    center,
    mapId: "aa9fe419627634d5",
     });

     for (const property of properties) {
      const position = {
        lat: Number(property.latitude ? property.latitude : 0),
        lng: Number(property.longitude ? property.longitude: 0)
      }
      const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
        map,
        content: this.buildContent(property),
        position: position,
        title: property.nome_fantasia,
      });
  
      AdvancedMarkerElement.addListener("click", () => {
        this.toggleHighlight(AdvancedMarkerElement, property);
      });
    }

  }

  toggleHighlight(markerView:any, property:any) {
    if (markerView.content.classList.contains("highlight")) {
      markerView.content.classList.remove("highlight");
      markerView.zIndex = null;
    } else {
      markerView.content.classList.add("highlight");
      markerView.zIndex = 1;
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('span');
    div.appendChild(document.createTextNode(text ?? ''));
    return div.innerHTML;
  }

  buildContent(property:any) {
    const content = document.createElement("div");
    content.classList.add("property");

    const safeType = this.escapeHtml(property.type);
    const safeName = this.escapeHtml(property.nome_fantasia);

    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa fa-icon fa-${safeType}" title="${safeType}"></i>
          <span class="fa-sr-only">${safeType}</span>
      </div>
      <div class="details">
          <div class="price">${safeName}</div>
          <div class="address">${safeName}</div>
          <div class="features">
          <div>
              <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>
              <span class="fa-sr-only">bedroom</span>
              <span>${safeName}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
              <span class="fa-sr-only">bathroom</span>
              <span>${safeName}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>
              <span class="fa-sr-only">size</span>
              <span>${safeName} ft<sup>2</sup></span>
          </div>
          </div>
      </div>
      `;
    return content;
  }

    ConvertNumber(num:any) {
      return Number(num? num : 0)
    }

}
