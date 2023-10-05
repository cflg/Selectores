import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { ObservableInput, filter, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'countries-pages-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  public formulario: FormGroup = this.fB.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    borders: ['', [Validators.required]],
  });
  public countriesByRegion: SmallCountry[] = [];

  constructor(
    private fB: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.getRegions;
  }

  private onRegionChanged(): void {
    this.formulario
      .get('region')
      ?.valueChanges.pipe(
        tap(() => this.formulario.get('country')?.setValue('')),
        switchMap((reg) => this.countriesService.getCountriesByRegion(reg))
      )
      .subscribe((countries) => {
        this.countriesByRegion = countries;
      });
  }

  public onCountryChanged() {
    this.formulario
      .get('country')
      ?.valueChanges.pipe(
        tap(() => this.formulario.get('borders')!.setValue('')),
        filter((value) => value.length > 0),
        switchMap((alphacode) => {
          console.log(alphacode);
          return of(this.countriesService.getCountryByAlphacode(alphacode));
        })
      )
      .subscribe((country) => {
        console.log('Country Data:', country);
        console.log({ borders: country });
      });
  }
}
/* switchMap((region) =>
          this.countriesService.getCountriesByRegion(region)
        ) */
