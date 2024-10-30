// src/app/consumoapi/consumoapi.page.ts

import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../services/rick-and-morty.service';

@Component({
  selector: 'app-consumo-api',
  templateUrl: './consumoapi.page.html',
  styleUrls: ['./consumoapi.page.scss'],
})
export class ConsumoApiPage implements OnInit { // Asegúrate de que el nombre sea "ConsumoApiPage"
  characters: any[] = [];

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit() {
    this.rickAndMortyService.getCharacters().subscribe(response => {
      this.characters = response.results;
    });
  }
}
