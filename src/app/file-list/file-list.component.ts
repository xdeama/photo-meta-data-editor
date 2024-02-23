import {Component} from '@angular/core';

import { ElectronService } from 'app/core/services/electron/electron.service';
import { resolve } from 'path';
import { NgForOf } from "@angular/common";
import {MatList, MatListItem, MatListItemMeta, MatListSubheaderCssMatStyler} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {Osfile} from "../osfile";
import * as path from 'path';
import {MatChip, MatChipListbox, MatChipOption} from "@angular/material/chips";
import {MatLine, provideNativeDateAdapter} from "@angular/material/core";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-file-list',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    NgForOf,
    MatList,
    MatListItem,
    MatIcon,
    MatDivider,
    MatListSubheaderCssMatStyler,
    MatChip,
    MatListItemMeta,
    MatLine,
    MatLabel,
    MatHint,
    MatInput,
    MatDatepicker,
    MatDatepickerInput,
    MatChipOption,
    MatChipListbox,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker
  ],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss'
})
export class FileListComponent {
  protected currentPath: string = "";
  protected imagePath: string = "";
  protected entries: Array<Osfile> = [];
  constructor(private electronService: ElectronService) {

  }
  ngOnInit(): void {
    this.updateEntries("/Users/deama/Workspace/scrapyard").catch(error => console.error('Failed to update entries:', error));
  }

  private async updateEntries(newPath: string) {
    try {
      const files = await this.electronService.fs.promises.readdir(newPath);
      console.log(files)

      const upOneLevel: Osfile = {
        name: "../",
        path: "../",
        extension: "",
        folder: true
      };

      const fileMappings = files.map(async (file) => {
        const filePath = path.join(newPath, file); // Use path.join for path concatenation
        return this.mapToOsFiles(filePath);
      });

      // Await the resolution of all file mapping promises
      const mappedFiles = await Promise.all(fileMappings);

      console.log(mappedFiles)

      // Combine "up one level" with mapped files and assign to this.entries
      this.entries = [upOneLevel, ...mappedFiles];
      this.currentPath = newPath;
    } catch (error) {
      console.error(error);
    }
  }


  protected changeDir(newDir: string) {
    console.log("changing currentDir to " + newDir)
    const targetPath = resolve(this.currentPath, newDir);
    console.log("resolved new targetPath " + targetPath)
    this.electronService.fs.stat(targetPath, (err, stats) => {
      if (err) {
        console.error(err);
      }
      if (stats.isFile()) {
        console.log("found file path: " + targetPath)
        this.imagePath = "extfile://"+targetPath;
      } else if (stats.isDirectory()) {
        console.log("changeDir is folder, currentpath is " + this.currentPath)
        this.updateEntries(targetPath).catch(error => console.error('Failed to update entries:', error));
      } else {
        console.error(new Error(`Unknown file system object: ${targetPath}`));
      }
    });
  }

  private mapToOsFiles(path: string): Promise<Osfile> {
    return new Promise((resolve, reject) => {
      this.electronService.fs.stat(path, (err, stats) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          let extension: string = '';
          let folder: boolean = false;
          let fileOrFolderName: string = '';

          if (stats.isFile()) {
            this.imagePath = "extfile://" + path;
            fileOrFolderName = path.split('/').pop() || '';
            const lastDotIndex = fileOrFolderName.lastIndexOf('.');
            if (lastDotIndex > 0 && lastDotIndex < fileOrFolderName.length - 1) {
              extension = fileOrFolderName.substring(lastDotIndex);
            }
            folder = false;
          } else if (stats.isDirectory()) {
            folder = true;
            fileOrFolderName = path.split('/').pop() || '';
          } else {
            console.error(new Error(`Unknown file system object: ${path}`));
            reject(new Error(`Unknown file system object: ${path}`));
          }

          const mappedFile: Osfile = {
            name: fileOrFolderName,
            path: path,
            extension: extension,
            folder: folder,
          };

          resolve(mappedFile);
        }
      });
    });
  }


}
