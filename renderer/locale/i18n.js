
const { appName } = require('../../app.config')

module.exports = {
  en: {
    appName: appName,
    appDescription: 'To make this screen look great, simply replace the app icon and the app name above with your project credentials, and add an encouraging welcome message.',
    signInButton: 'Sign in with Webasyst ID',
    logout: 'Log out',
    cloud: {
      title: 'New Webasyst account',
      button: 'Create Webasyst Account',
      desc: 'A new Webasyst Cloud account will be automatically created with awesome apps pre-installed. This will be an account for your entire team.',
      loading: 'Creating an account...'
    },
    loading: 'Loading...',
    errors: {
      cloud: {
        not_allow_signup_account: 'Sorry, we cannot create another account for you at the moment. Most likely, a limit on the number of free Webasyst cloud accounts has been exceeded.',
        already_exists: 'Sorry, we cannot create another account for you at the moment. Most likely, a limit on the number of free Webasyst cloud accounts has been exceeded.'
      }
    }
  },
  ru: {
    appName: appName,
    appDescription: 'Чтобы эта страница была не такой скучной, подставьте иконку и название своего приложения и напишите какой-нибудь классный приветственный текст.',
    signInButton: 'Войти с Webasyst ID',
    logout: 'Выйти',
    cloud: {
      title: 'Новый аккаунт Webasyst',
      button: 'Создать аккаунт Webasyst',
      desc: 'В облаке Webasyst будет развернут новый аккаунт с предустановленными приложениями. Вы сможете приглашать своих коллег в этот аккаунт для совместной работы.',
      loading: 'Создаю новый аккаунт...'
    },
    loading: 'Загрузка...',
    errors: {
      cloud: {
        not_allow_signup_account: 'Не удалось создать аккаунт Webasyst. Скорее всего, превышен лимит на количество бесплатных облачных аккаунтов.',
        already_exists: 'Не удалось создать аккаунт Webasyst. Скорее всего, превышен лимит на количество бесплатных облачных аккаунтов.'
      }
    }
  }
}
