import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



@Component({
  selector: 'front-zapfarma-rodape',
  templateUrl: './rodape.component.html',
  styleUrls: ['./rodape.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule
]

})

export class RodapeComponent { 

}