import {
  AlertButton,
  AlertController,
  AlertInput,
  IonicSafeString,
} from '@ionic/angular';

interface options {
  inputs?: AlertInput[];
  buttons?: (string | AlertButton)[] | undefined;
  cssClass?: string | string[] | undefined;
  header?: string | undefined;
  subHeader?: string | undefined;
  message?: string | IonicSafeString | undefined;
}

export async function showAlertDialog(
  alertController: AlertController,
  { inputs, buttons, cssClass, header, subHeader, message }: options
) {
  const alert = await alertController.create({
    header: header,
    inputs,
    buttons,
    cssClass,
    subHeader,
    message,
  });

  await alert.present();
}
