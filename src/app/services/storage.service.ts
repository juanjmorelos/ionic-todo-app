import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../core/interfaces/category.interface';
import { UserTask } from '../core/interfaces/userTask.interface';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private _storage: Storage | null = null;
  private categoryKey = 'categories';
  private taskKey = 'tasks';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  // ---------- Categorías ----------
  async getCategories(): Promise<Category[]> {
    if (!this._storage) {
      await this.init();
    }
    console.log('Storage instance:', this._storage);
    const data = await this._storage?.get(this.categoryKey);
    console.log('Fetched from storage:', data);
    return data || [];
  }

  async addCategory(category: string): Promise<void> {
    const categories = await this.getCategories();
    const id = categories.length
      ? Math.max(...categories.map((c) => c.id)) + 1
      : 1;
    categories.push({ id, category });
    await this._storage?.set(this.categoryKey, categories);
  }

  async updateCategory(updated: Category): Promise<void> {
    const categories = await this.getCategories();
    const index = categories.findIndex((c) => c.id === updated.id);
    if (index > -1) {
      categories[index] = updated;
      await this._storage?.set(this.categoryKey, categories);
    }
  }

  async deleteCategory(id: number): Promise<void> {
    if (!this._storage) await this.init();

    // Eliminar categoría
    const categories = (await this.getCategories()).filter((c) => c.id !== id);
    await this._storage?.set(this.categoryKey, categories);

    // Eliminar tareas de esa categoría
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(
      (t) => Number(t.categoryId) !== Number(id)
    );
    await this._storage?.set(this.taskKey, filteredTasks);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const categories = await this.getCategories();
    return categories.find((c) => c.id === id);
  }

  // ---------- Tareas ----------
  async getTasks(): Promise<UserTask[]> {
    return (await this._storage?.get(this.taskKey)) || [];
  }

  async addTask(task: Omit<UserTask, 'id'>): Promise<void> {
    const tasks = await this.getTasks();
    const id = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    tasks.push({ id, ...task });
    await this._storage?.set(this.taskKey, tasks);
  }

  async updateTask(updated: UserTask): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === updated.id);
    if (index > -1) {
      tasks[index] = updated;
      await this._storage?.set(this.taskKey, tasks);
    }
  }

  async deleteTask(id: number): Promise<void> {
    const tasks = (await this.getTasks()).filter((t) => t.id !== id);
    await this._storage?.set(this.taskKey, tasks);
  }

  async getTasksByCategory(categoryId: number): Promise<UserTask[]> {
    const tasks = await this.getTasks();
    return tasks.filter(
      (t) => t.categoryId.toString() === categoryId.toString()
    );
  }

  async getTaskById(id: number): Promise<UserTask | undefined> {
    const tasks = await this.getTasks();
    return tasks.find((t) => t.id === id);
  }

  async saveAllTasks(tasks: UserTask[]): Promise<void> {
    await this._storage?.set(this.taskKey, tasks);
  }
  
}
