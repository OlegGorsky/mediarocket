import toast from 'react-hot-toast';

export const handleApiResponse = (response: any, onSubscriptionCheck: () => void): void => {
  console.log('Full API Response:', response);

  if (!Array.isArray(response) || response.length === 0) {
    toast.error('Некорректный ответ от сервера');
    return;
  }

  const subscriptionStatus = response[0];

  switch (subscriptionStatus) {
    case 'yes':
      toast.success('Отлично! Видим подписку. Вам начислено 100 РокетКоинов!');
      onSubscriptionCheck();
      break;
    case 'no':
      toast.error('К сожалению, не видим вашей подписки. Сначала подпишитесь, чтоб получить 100 РокетКоинов.');
      break;
    case 'unscribe':
      toast.error('Вы уже получили 100 РокетКоинов, но почему-то отписались от ТГ-канала.');
      break;
    case 'again':
      toast.error('Вы уже получили 100 РокетКоинов за подписку на этот ТГ-канал!');
      break;
    case 'unknown':
      toast.error('Статус подписки неизвестен. Пожалуйста, попробуйте позже.');
      break;
    default:
      toast.error('Неизвестный статус подписки.');
  }
};
