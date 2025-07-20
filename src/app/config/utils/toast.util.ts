import { ToastController } from '@ionic/angular';

export async function showToast(
  toastController: ToastController,
  message: string,
  duration: number = 1500
) {
  const toast = await toastController.create({
    message,
    duration: duration,
    position: 'bottom',
  });
  await toast.present();
}
