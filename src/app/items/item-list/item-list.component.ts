import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mitem } from 'src/app/shared/components/models/mitem.model';
import { MitemService } from 'src/app/shared/services/mitem.service';
import { Tablesort } from 'src/app/shared/scripts//Tablesort'

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {


  items: Mitem [];
  searchCat = "";

  constructor(private mitemService: MitemService, private router: Router) { }

  ngOnInit(): void {
    this.getData();
    new Tablesort(document.getElementById('table'));
  }

  async getData(){
    
    try{
      let items = this.mitemService.getAll();
      
      this.items = (await items === null || await items === undefined) ? [] : await items;
      
      }catch(err){
        console.error(err);
      }
  }

  onLinkProfile(id: number) {
    this.router.navigate([this.router.url, 'edit', id]);
  }
  
  onAddProfile() {
    this.router.navigate([this.router.url, 'edit']);
  }

  async onDelete(item: { id: number; }) {
    try {
      await this.mitemService.deleteOneById(item.id);
  
    } catch (err) {
      console.error(err);
    } finally {
      
      this.getData();
  
    }
  }

  async onIncAmount(num:number){
    try{
      this.items[num-1].amount++;
      await this.mitemService.putOneById(num, this.items[num-1]);
      this.getData();
    }catch(err){
      console.error(err);
    }
  }

async onDecAmount(num:number){
  try{
    if(this.items[num-1].amount != 0){
      this.items[num-1].amount--;
      await this.mitemService.putOneById(num, this.items[num-1]);
      this.getData();
    }
  }catch(err){
    console.error(err);
  }
}

}
