import { useToast as useToastNotification, type ToastPropsWithMessage } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';


export const useToast = () => {
  const toast = useToastNotification();
  
  const notify = (toastParams: ToastPropsWithMessage) => {
    toast.open({
      position: 'top-right',
      duration: 1500,
      ...toastParams,
    })
  }

  return { notify }
}