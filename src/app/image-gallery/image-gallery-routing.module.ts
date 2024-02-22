import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {ImageGalleryComponent} from "./image-gallery.component";

const routes: Routes = [
  {
    path: 'image-gallery',
    component: ImageGalleryComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageGalleryRoutingModule {}
