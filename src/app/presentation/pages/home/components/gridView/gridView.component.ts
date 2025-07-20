import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from 'src/app/core/interfaces/category.interface';

@Component({
  selector: 'grid-view',
  templateUrl: './gridView.component.html',
  styleUrls: ['../../home.page.css'],
  standalone: false,
})
export class GridViewComponent {
  @Input() groupedCategories: Category[][] = [];
  @Input() taskCounts: { [categoryId: number]: number } = {};

  @Output() onManageCategory = new EventEmitter<Category>();
  @Output() onDeleteCategory = new EventEmitter<Category>();

  manageTaskCategory(item: Category) {
    this.onManageCategory.emit(item);
  }

  deleteCategory(item: Category) {
    this.onDeleteCategory.emit(item);
  } 
 }
