
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Este navegador não suporta notificações");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = async (title: string, options?: NotificationOptions) => {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    const registration = await navigator.serviceWorker.ready;
    
    if (registration.showNotification) {
      return registration.showNotification(title, {
        icon: '/favicon.ico',
        ...options,
      });
    } else {
      return new Notification(title, {
        icon: '/favicon.ico',
        ...options,
      });
    }
  }
  
  return null;
};
