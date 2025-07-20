export interface UserTask {
  id: number;
  categoryId: number;
  task: string;
  date: string;
  state: 'pending' | 'done' | 'expired';
}
