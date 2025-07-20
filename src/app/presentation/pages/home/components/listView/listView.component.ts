import { Component, EventEmitter, Output, Input } from '@angular/core';
import { UserTask } from 'src/app/core/interfaces/userTask.interface';
import { getFormattedDate } from 'src/app/config/utils/date.util'

@Component({
  selector: 'app-list-view',
  templateUrl: './listView.component.html',
  styleUrls: ['./listView.component.css'],
  standalone: false,
})
export class ListViewComponent {
  @Input() tasks: UserTask[] = [];

  @Output() onToggleTask = new EventEmitter<UserTask>();
  @Output() onDeleteTask = new EventEmitter<UserTask>();

  toggleTaskState(task: UserTask) {
    this.onToggleTask.emit(task);
  }

  deleteTask(task: UserTask) {
    this.onDeleteTask.emit(task);
  }

  formatDate(date: string) {
    return getFormattedDate(date)
  }
  
}
