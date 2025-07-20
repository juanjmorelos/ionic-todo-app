import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UserTask } from 'src/app/core/interfaces/userTask.interface';
import { showAlertDialog } from 'src/app/config/utils/alert.util';
import { showToast } from 'src/app/config/utils/toast.util';
import { Category } from 'src/app/core/interfaces/category.interface';
import { getFormattedDate } from 'src/app/config/utils/date.util';

@Component({
  selector: 'manage-category-manage',
  templateUrl: './manageCategory.page.html',
  styleUrls: ['./manageCategory.page.css'],
  standalone: false,
})
export class ManageCategoryPage {
  public categoryName: String = '';
  private categoryId!: number;
  public tasks: UserTask[] = [];

  constructor(
    private service: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.checkAndMarkExpiredTasks();
    this.loadCategory();
  }

  async loadCategory() {
    const param = this.route.snapshot.paramMap.get('categoryId');

    if (!param) {
      this.router.navigate(['/home']);
      return;
    }

    this.categoryId = +param;

    const category = await this.service.getCategoryById(this.categoryId);
    const taskByCategory = await this.service.getTasksByCategory(
      this.categoryId
    );
    if (!category) {
      this.router.navigate(['/home']);
      return;
    }

    this.categoryName = category.category;
    this.tasks = taskByCategory || [];
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
            this.loadCategory();
          },
        },
      ],
    });
  }

  toggleTaskState(item: UserTask) {
    if (item.state === 'expired') return;

    item.state = item.state === 'done' ? 'pending' : 'done';
    this.service.updateTask(item);
  }

  async checkAndMarkExpiredTasks() {
    const tasks = await this.service.getTasks();
    const now = new Date();

    const updatedTasks: UserTask[] = tasks.map((task) => {
      const taskDate = new Date(task.date);
      if (task.state === 'pending' && taskDate.getTime() < now.getTime()) {
        return { ...task, state: 'expired' };
      }
      return task;
    });

    const hasChanges = updatedTasks.some((t, i) => t.state !== tasks[i].state);
    if (hasChanges) {
      await this.service.saveAllTasks(updatedTasks);
    }
  }

  editCategory() {
    showAlertDialog(this.alertController, {
      header: 'Editar nombre de categoría',
      inputs: [
        {
          name: 'categoryName',
          type: 'text',
          placeholder: 'Nombre de la categoría',
          value: this.categoryName,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'destroy',
        },
        {
          text: 'Editar',
          handler: async (data) => {
            const categoryName = data.categoryName?.trim();
            if (categoryName) {
                const updatedCategory: Category = {
                    id: this.categoryId,
                    category: categoryName
                }
              await this.service.updateCategory(updatedCategory)
              this.loadCategory();
              showToast(this.toastController, 'Categoría actualizada exitosamente!');
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
      cssClass: "custom-alert"
    });
  }


  formatDate(date: string) {
    return getFormattedDate(date)
  }
}
