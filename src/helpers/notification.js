import PushNotification from "react-native-push-notification";

const CHANNEL_ID = "payment-notification";

export const sendLocalNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: CHANNEL_ID,
    title,
    message,
  });
};

export const sendScheduledNotification = (title, message, date) => {
  PushNotification.localNotificationSchedule({
    channelId: CHANNEL_ID,
    title,
    message,
    date,
  });
};
