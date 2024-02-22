import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Gallery, GalleryModule, GalleryItem, ImageSize, ThumbnailsPosition} from 'ng-gallery';
import {GallerizeDirective, Lightbox, LightboxModule} from "ng-gallery/lightbox";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [GalleryModule, GallerizeDirective, LightboxModule, RouterLink, TranslateModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss'
})
export class ImageGalleryComponent implements OnInit {

  items: GalleryItem[] | undefined;
  @ViewChild("itemTemplate", { static: true }) itemTemplate: TemplateRef<any> | undefined;

  imageData = data;

  constructor(public gallery: Gallery, public lightbox: Lightbox) {}

  ngOnInit() {
    /** Basic Gallery Example */

    // Creat gallery items
    this.items = this.imageData.map(item => {
      return {
        type: "imageViewer",
        data: {
          src: item.srcUrl,
          thumb: item.previewUrl
        }
      };
    });

    /** Lightbox Example */

      // Get a lightbox gallery ref
    const lightboxRef = this.gallery.ref("lightbox");

    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
      itemTemplate: this.itemTemplate,
      //gestures: false
    });

    // Load items into the lightbox gallery ref
    lightboxRef.load(this.items);
  }
}

const data = [
  {
    srcUrl: "/assets/images/penguin.jpeg",
    previewUrl: "/assets/images/penguin.jpeg"
  },
  {
    srcUrl: "/assets/images/penguin.jpeg",
    previewUrl: "/assets/images/penguin.jpeg"
  },
  {
    srcUrl: "/assets/images/penguin.jpeg",
    previewUrl: "/assets/images/penguin.jpeg"
  },
  {
    srcUrl: "/assets/images/penguin.jpeg",
    previewUrl: "/assets/images/penguin.jpeg"
  }
];
