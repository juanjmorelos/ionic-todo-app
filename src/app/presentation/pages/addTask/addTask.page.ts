import { Component, ViewChild } from '@angular/core';
import {
  IonDatetime,
  IonSelect,
  IonTextarea,
  ToastController,
} from '@ionic/angular';
import { showToast } from 'src/app/config/utils/toast.util';
import { Category } from 'src/app/core/interfaces/category.interface';
import { StorageService } from 'src/app/services/storage.service';
import { UserTask } from 'src/app/core/interfaces/userTask.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'add-task',
  templateUrl: './addTask.page.html',
  styleUrls: ['./addTask.page.css'],
  standalone: false,
})
export class AddTaskPage {
  public categories: Category[] = [];
  @ViewChild('task', { static: false }) taskTextarea!: IonTextarea;
  @ViewChild('datetime', { static: false }) datetimePicker!: IonDatetime;
  @ViewChild('category', { static: false }) categorySelect!: IonSelect;

  constructor(
    private service: StorageService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async saveTask() {
    const taskText = await this.taskTextarea
      .getInputElement()
      .then((el) => el.value);
    const dateValue = await this.datetimePicker.value;
    const categoryValue = await this.categorySelect.value;

    if (!this.isValidForm(taskText, categoryValue)) {
      showToast(
        this.toastController,
        'Por favor ingresa tu tarea y selecciona la categoría'
      );
      return;
    }
    if (!this.isValidDate(dateValue)) {
      showToast(this.toastController, 'Por favor selecciona una fecha valida');
      return;
    }

    const newTask: Omit<UserTask, 'id'> = {
      task: taskText,
      date: Array.isArray(dateValue)
        ? new Date(dateValue[0]).toISOString()
        : new Date(dateValue!).toISOString(),
      state: 'pending',
      categoryId: categoryValue,
    };

    await this.service.addTask(newTask);
    showToast(this.toastController, 'Categoría guardada exitosamente');
    this.navCtrl.back();
  }

  async loadCategories() {
    this.categories = await this.service.getCategories();
  }

  isValidDate(dateValue: string | string[] | null | undefined): boolean {
    if (!dateValue || Array.isArray(dateValue)) return false;

    const selectedDate = new Date(dateValue);
    const now = new Date();

    return selectedDate > now;
  }

  isValidForm(
    taskText: string | undefined | null,
    categoryValue: any
  ): boolean {
    return !!taskText?.trim() && !!categoryValue?.toString().trim();
  }
  
}
