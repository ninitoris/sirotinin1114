import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Mitem } from 'src/app/shared/components/models/mitem.model';
import { MitemService } from 'src/app/shared/services/mitem.service';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {

  id: number;
  item: Mitem;
  mask = [];
  itemForm: FormGroup;

  constructor(
    private activatedRouter: ActivatedRoute,
    private mitemService: MitemService,
    private router: Router
  ) { 
    this.activatedRouter.params.subscribe((param) => {
      this.id = param.id;
    });
  }

  ngOnInit(): void {
    let digitmask = /^\d+$/;
    let weightmask = /^\d+(.\d+)?$/


    this.itemForm = new FormGroup({
      

      name: new FormControl(null,[Validators.required]),
      artikul: new FormControl(null,[Validators.required]),
      price: new FormControl(null,[Validators.pattern(digitmask), Validators.required]),
      proizvoditel: new FormControl(null,[Validators.required]),
      categoriya: new FormControl(null,[Validators.required]),
      weight: new FormControl(null,[Validators.pattern(weightmask), Validators.required]),
      amount: new FormControl(null,[Validators.pattern(digitmask), Validators.required]),


    });
    this.getData();

  }

  async getData() {
    if (!(this.id === null || this.id === undefined)) {
      try {
        let item = this.mitemService.getOneById(this.id);
        this.item = await item;
      } catch (err) {
        console.error(err);
      }
      this.itemForm.patchValue({
       name: this.item.name,
       artikul: this.item.artikul,
       price: this.item.price,
       proizvoditel: this.item.proizvoditel,
       categoriya: this.item.categoriya,
       weight: this.item.weight,
       amount: this.item.amount
       
      });
    }
  }
  async onSave() {
    if (!(this.id === null || this.id === undefined)) {
      try {
        await this.mitemService.putOneById(this.id, this.itemForm.value);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        let res = await this.mitemService.postOne(this.itemForm.value);
        this.router.navigate([this.router.url, res.id]);
        this.getData();
      } catch (err) {
        console.error(err);
      }
    }
  }
  
  async onDelete(item: { id: number; }) {
    try {
      console.log(this.item)
      await this.mitemService.deleteOneById(item.id);

    } catch (err) {
      console.error(err);
    }finally{
      this.getData();
    }
  
  }

}
