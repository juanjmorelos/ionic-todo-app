import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { showAlertDialog } from 'src/app/config/utils/alert.util';
import { showToast } from 'src/app/config/utils/toast.util';
import { Category } from 'src/app/core/interfaces/category.interface';
import { StorageService } from 'src/app/services/storage.service';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { UserTask } from 'src/app/core/interfaces/userTask.interface';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.css'],
  standalone: false,
})
export class HomePage {
  public categories: Category[] = [];
  public taskCounts: { [categoryId: number]: number } = {};
  public homePageType: 'category' | 'all' = 'all';
  public filter: 'grid' | 'list' = 'list';
  public tasks: UserTask[] = [];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private service: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private firebaseX: FirebaseX,
    private ngZone: NgZone,
  ) {
    document.addEventListener('deviceready', () => {
      this.initializeFirebase();
    }, false);
  }

  ionViewWillEnter() {
    this.loadCategories();
  }

  async initializeFirebase() {
    try {
      await this.firebaseX.setDefaults({ homePageType: 'all' });

      await this.firebaseX.fetch(0);

      await this.firebaseX.activateFetched();

      const text = await this.firebaseX.getValue('homePageType');
      this.ngZone.run(() => {
        this.homePageType = text;
      });
    } catch (error) {
      console.error('Error al obtener Remote Config:', error);
    }
  }

  async loadCategories() {
    this.categories = await this.service.getCategories();
    this.tasks = await this.service.getTasks();
    for (const cat of this.categories) {
      const tasks = await this.service.getTasksByCategory(cat.id);
      this.taskCounts[cat.id] = tasks.length;
    }
  }

  manageTaskCategory(item: Category) {
    if (this.taskCounts[item.id] > 0) {
      this.router.navigate([`../manageCategory/${item.id}`], {
        relativeTo: this.route,
      });
      return;
    }
    showToast(
      this.toastController,
      'Agrega un tarea a esta categoría para verlas'
    );
  }
  
  onAddTask() {
    if(this.categories.length === 0) {
      showToast(
        this.toastController,
        'Agrega al menos una categorpia para empear agregar tareas'
      );
      return;
    }
    this.router.navigate(['../addTask'], { relativeTo: this.route });
  }

  deleteCategory(item: Category) {
    showAlertDialog(this.alertController, {
      header: 'Eliminar categoría',
      message: `Está seguro que desea eliminar la categoría "${item.category}"`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'destroy',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.service.deleteCategory(item.id);
            if (this.taskCounts[item.id] > 0) {
              this.navCtrl.back();
              return;
            }
            this.loadCategories();
          },
        },
      ],
    });
  }

  async onAddCategory() {
    await showAlertDialog(this.alertController, {
      header: 'Nueva categoría',
      inputs: [
        {
          name: 'categoryName',
          type: 'text',
          placeholder: 'Nombre de la categoría',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'destroy',
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            const categoryName = data.categoryName?.trim();
            if (categoryName) {
              await this.service.addCategory(categoryName);
              this.loadCategories();
              showToast(this.toastController, 'Categoría creada exitosamente!');
              return true;
            } else {
              showToast(
                this.toastController,
                'Debes escribir un nombre de categoría'
              );
              return false;
            }
          },
        },
      ],
      cssClass: 'custom-alert',
    });
  }

  get actionSheetButtons() {
    return [
      {
        text: 'Nueva tarea',
        handler: () => this.onAddTask(),
        disabled: this.categories.length === 0,
      },
      {
        text: 'Nueva categoría',
        handler: () => this.onAddCategory(),
      },
    ];
  }

  get groupedCategories(): Category[][] {
    const grouped: Category[][] = [];
    for (let i = 0; i < this.categories.length; i += 2) {
      grouped.push(this.categories.slice(i, i + 2));
    }
    return grouped;
  }

  toggleTaskState(item: UserTask) {
    if (item.state === 'expired') return;

    item.state = item.state === 'done' ? 'pending' : 'done';
    this.service.updateTask(item);
  }

  deleteTask(item: UserTask) {
    showAlertDialog(this.alertController, {
      header: 'Eliminar tarea',
      message: `Está seguro que desea eliminar la tarea "${item.task}"`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'destroy',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.service.deleteTask(item.id);
            this.loadCategories();
          },
        },
      ],
    });
  }

  setFilter(filter: 'grid' | 'list') {
    this.filter = filter;
  }
}
