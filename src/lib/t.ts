import type { Locale } from './i18n-shared'

const dict = {
  // ── Navigation ────────────────────────────────────────────────────────────
  'nav.overview': { ru: 'Обзор', en: 'Overview' },
  'nav.card': { ru: 'Карта', en: 'Card' },
  'nav.billing': { ru: 'Биллинг', en: 'Billing' },
  'nav.friends': { ru: 'Друзья', en: 'Friends' },
  'nav.settings': { ru: 'Настройки', en: 'Settings' },
  'nav.logout': { ru: 'Выйти', en: 'Log Out' },
  'nav.notifications': { ru: 'Уведомления', en: 'Notifications' },
  'nav.close': { ru: 'Закрыть', en: 'Close' },

  // ── Dashboard marquee ─────────────────────────────────────────────────────
  'dash.marquee.cabinet': { ru: 'ТВОЙ КАБИНЕТ IMBA', en: 'YOUR IMBA DASHBOARD' },
  'dash.marquee.products': { ru: 'eSIM · VPN · КАРТА', en: 'eSIM · VPN · CARD' },
  'dash.marquee.borders': { ru: 'БЕЗ ГРАНИЦ', en: 'NO BORDERS' },
  'dash.marquee.questions': { ru: 'БЕЗ ЛИШНИХ ВОПРОСОВ', en: 'NO QUESTIONS ASKED' },

  // ── Dashboard overview ────────────────────────────────────────────────────
  'dash.greeting.morning': { ru: 'Доброе утро', en: 'Good morning' },
  'dash.greeting.afternoon': { ru: 'Добрый день', en: 'Good afternoon' },
  'dash.greeting.evening': { ru: 'Добрый вечер', en: 'Good evening' },
  'dash.subtitle': { ru: 'Вот что происходит с твоими сервисами', en: "Here's what's happening with your services" },
  'dash.plan': { ru: 'План IMBA', en: 'IMBA Plan' },
  'dash.balance': { ru: 'Доступный баланс', en: 'Available balance' },
  'dash.topup': { ru: 'Пополнить', en: 'Top Up' },
  'dash.expired': { ru: 'Истёк', en: 'Expired' },
  'dash.until': { ru: 'до', en: 'until' },
  'dash.extend': { ru: 'Продлить', en: 'Extend' },
  'dash.gb': { ru: 'ГБ', en: 'GB' },
  'dash.of_gb': { ru: 'из', en: 'of' },
  'dash.buy_esim': { ru: 'Купить eSIM', en: 'Buy eSIM' },
  'dash.esim_subtitle': { ru: '190+ стран, активация по QR', en: '190+ countries, QR activation' },
  'dash.active': { ru: 'Активен', en: 'Active' },
  'dash.enable_vpn': { ru: 'Включить VPN', en: 'Enable VPN' },
  'dash.vpn_subtitle': { ru: 'VPN на каждый день, без лагов и логов', en: 'Daily VPN, no lag, no logs' },
  'dash.card_chip': { ru: 'Карта', en: 'Card' },
  'dash.issue_card': { ru: 'Выпустить карту', en: 'Issue Card' },
  'dash.recent_ops': { ru: 'Последние операции', en: 'Recent Activity' },
  'dash.all': { ru: 'Все →', en: 'All →' },

  // ── Dashboard trial ───────────────────────────────────────────────────────
  'dash.trial_tomorrow': { ru: 'Завтра заканчивается пробный период!', en: 'Trial ends tomorrow!' },
  'dash.trial_activated': { ru: 'VPN 7 дней + eSIM 500 МБ активированы!', en: 'VPN 7 days + eSIM 500 MB activated!' },
  'dash.promo_applied': { ru: 'Промокод успешно применён!', en: 'Promo code applied!' },

  // ── Settings ──────────────────────────────────────────────────────────────
  'settings.title': { ru: 'Настройки', en: 'Settings' },
  'settings.subtitle': { ru: 'Профиль, язык, безопасность', en: 'Profile, language, security' },
  'settings.currency': { ru: 'Валюта', en: 'Currency' },
  'settings.currency_desc': { ru: 'В какой валюте отображать баланс и цены', en: 'Display currency for balance and prices' },
  'settings.profile': { ru: 'Профиль', en: 'Profile' },
  'settings.name': { ru: 'Имя', en: 'Name' },
  'settings.language': { ru: 'Язык', en: 'Language' },
  'settings.language_value': { ru: 'Русский', en: 'English' },
  'settings.created': { ru: 'Аккаунт создан', en: 'Account created' },
  'settings.support': { ru: 'Поддержка', en: 'Support' },
  'settings.support_desc': { ru: 'Если что-то не работает — мы рядом. Среднее время ответа — 12 минут.', en: "Something not working? We're here. Average response time — 12 minutes." },
  'settings.contact_support': { ru: 'Написать в поддержку', en: 'Contact Support' },
  'settings.account': { ru: 'Аккаунт', en: 'Account' },
  'settings.logout_desc': { ru: 'Выйти из аккаунта на этом устройстве', en: 'Sign out on this device' },
  'settings.logout': { ru: 'Выйти из аккаунта', en: 'Sign Out' },

  // ── Card ───────────────────────────────────────────────────────────────────
  'card.holder': { ru: 'Держатель', en: 'Cardholder' },
  'card.balance': { ru: 'Баланс', en: 'Balance' },
  'card.expiry': { ru: 'Срок', en: 'Expiry' },
  'card.title': { ru: 'Виртуальная карта', en: 'Virtual Card' },
  'card.subtitle': { ru: 'Visa для оплаты зарубежных сервисов', en: 'Visa for international payments' },
  'card.active_count': { ru: 'активных', en: 'active' },
  'card.status_active': { ru: '● Активна', en: '● Active' },
  'card.status_frozen': { ru: '❄ Заморожена', en: '❄ Frozen' },
  'card.status_expired': { ru: 'Истекла', en: 'Expired' },
  'card.issue_heading': { ru: 'Открой карту IMBA', en: 'Get your IMBA card' },
  'card.issue_desc': { ru: 'Моментальный выпуск. Оплата Netflix, Spotify, ChatGPT, Adobe и любых зарубежных сервисов.', en: 'Instant issue. Pay for Netflix, Spotify, ChatGPT, Adobe, and any international service.' },
  'card.issue_free': { ru: 'Выпуск бесплатно', en: 'Free to issue' },
  'card.another': { ru: 'Ещё одна карта', en: 'Another card' },
  'card.name_placeholder': { ru: 'Имя на карте (латиницей)', en: 'Name on card' },
  'card.issue_btn': { ru: 'Выпустить карту бесплатно', en: 'Issue card for free' },
  'card.transactions': { ru: 'Операции', en: 'Transactions' },
  'card.topup_heading': { ru: 'Пополнение карты', en: 'Card top-up' },
  'card.amount_placeholder': { ru: 'Сумма USD', en: 'Amount USD' },
  'card.available': { ru: 'Доступно на балансе', en: 'Available balance' },
  'card.details_heading': { ru: 'Реквизиты карты — никому не передавай', en: 'Card details — do not share' },
  'card.number': { ru: 'Номер карты', en: 'Card number' },

  // ── Card actions ──────────────────────────────────────────────────────────
  'card.topup': { ru: 'Пополнить', en: 'Top Up' },
  'card.hide': { ru: 'Скрыть', en: 'Hide' },
  'card.show_details': { ru: 'Реквизиты', en: 'Details' },
  'card.unfreeze': { ru: 'Разморозить', en: 'Unfreeze' },
  'card.freeze': { ru: 'Заморозить', en: 'Freeze' },
  'card.enter_amount': { ru: 'Введи сумму', en: 'Enter amount' },
  'card.insufficient': { ru: 'Недостаточно средств', en: 'Insufficient funds' },

  // ── VPN ────────────────────────────────────────────────────────────────────
  'vpn.subtitle': { ru: 'VPN на всех ваших устройствах без лагов и логов!', en: 'VPN on all your devices — no lag, no logs!' },
  'vpn.plan': { ru: 'План', en: 'Plan' },
  'vpn.until': { ru: 'До:', en: 'Until:' },
  'vpn.not_connected': { ru: 'VPN не подключён', en: 'VPN not connected' },
  'vpn.included': { ru: 'Входит в вашу подписку — активация бесплатна', en: 'Included in your plan — free activation' },
  'vpn.locations': { ru: '5 локаций · без лагов · без логов', en: '5 locations · no lag · no logs' },
  'vpn.your_balance': { ru: 'Твой баланс', en: 'Your balance' },
  'vpn.activate': { ru: 'Активировать VPN', en: 'Activate VPN' },
  'vpn.servers': { ru: 'Серверы', en: 'Servers' },
  'vpn.servers_included': { ru: 'Входят в подписку', en: 'Included in plan' },
  'vpn.servers_count': { ru: '5 локаций включены в тариф', en: '5 locations included' },
  'vpn.ms': { ru: 'мс', en: 'ms' },

  // ── eSIM ───────────────────────────────────────────────────────────────────
  'esim.title': { ru: 'Твои eSIM', en: 'Your eSIMs' },
  'esim.subtitle': { ru: 'Глобальная eSIM — работает по всему миру', en: 'Global eSIM — works worldwide' },
  'esim.active_count': { ru: 'активных', en: 'active' },
  'esim.status_active': { ru: '● Активна', en: '● Active' },
  'esim.status_expired': { ru: 'Истекла', en: 'Expired' },
  'esim.status_processing': { ru: 'В обработке', en: 'Processing' },
  'esim.valid_until': { ru: 'Действует до:', en: 'Valid until:' },
  'esim.qr': { ru: 'QR-код', en: 'QR Code' },
  'esim.renew': { ru: 'Продлить', en: 'Renew' },
  'esim.empty': { ru: 'У тебя ещё нет eSIM', en: "You don't have an eSIM yet" },
  'esim.empty_desc': { ru: 'Выбери пакет ниже — активация по QR за минуту.', en: 'Pick a plan below — activate via QR in a minute.' },
  'esim.buy': { ru: 'Купить eSIM', en: 'Buy eSIM' },
  'esim.mb': { ru: 'МБ', en: 'MB' },
  'esim.per_gb': { ru: '/ГБ', en: '/GB' },

  // ── eSIM shop ─────────────────────────────────────────────────────────────
  'esim.search_placeholder': { ru: 'Введи страну назначения...', en: 'Search destination country...' },
  'esim.from': { ru: 'от', en: 'from' },
  'esim.packages': { ru: 'Пакеты данных', en: 'Data packages' },
  'esim.popular': { ru: 'Популярные направления', en: 'Popular destinations' },
  'esim.buy_btn': { ru: 'Купить', en: 'Buy' },
  'esim.buying': { ru: 'Покупаем…', en: 'Buying…' },
  'esim.bought': { ru: 'Куплено!', en: 'Done!' },
  'esim.low_balance': { ru: 'Мало', en: 'Low' },
  'esim.insufficient': { ru: 'Недостаточно средств', en: 'Insufficient funds' },
  'esim.no_connection': { ru: 'Нет соединения', en: 'No connection' },

  // ── Billing ───────────────────────────────────────────────────────────────
  'billing.title': { ru: 'Биллинг', en: 'Billing' },
  'billing.subtitle': { ru: 'Баланс, план и платежи', en: 'Balance, plan & payments' },
  'billing.current_balance': { ru: 'Текущий баланс', en: 'Current balance' },
  'billing.balance_desc': { ru: 'Используется для покупок и подписок', en: 'Used for purchases and subscriptions' },
  'billing.current_plan': { ru: 'Текущий план', en: 'Current plan' },
  'billing.free': { ru: 'Бесплатно', en: 'Free' },
  'billing.active_until': { ru: 'Активен до:', en: 'Active until:' },
  'billing.topup_balance': { ru: 'Пополнить баланс', en: 'Top Up Balance' },
  'billing.demo_notice': { ru: 'Demo-режим: мгновенное зачисление без оплаты. Для теста.', en: 'Demo mode: instant credit, no real payment. For testing.' },
  'billing.amount_placeholder': { ru: 'Сумма в USD', en: 'Amount in USD' },
  'billing.combo_desc': { ru: 'VPN + eSIM + виртуальная карта — всё в одной подписке, с первого дня', en: 'VPN + eSIM + virtual card — all-in-one subscription from day one' },
  'billing.monthly': { ru: 'Списывается с баланса раз в месяц', en: 'Charged monthly from balance' },
  'billing.connected': { ru: 'Подключено', en: 'Connected' },
  'billing.connect_combo': { ru: 'Подключить COMBO →', en: 'Get COMBO →' },
  'billing.other_plans': { ru: 'Другие тарифы', en: 'Other Plans' },
  'billing.other_plans_desc': { ru: 'Или начни бесплатно — подключи услуги по отдельности', en: 'Or start free — add services individually' },
  'billing.current': { ru: 'Текущий план', en: 'Current Plan' },
  'billing.history': { ru: 'История платежей', en: 'Payment History' },
  'billing.history_desc': { ru: 'Последние 20 транзакций', en: 'Last 20 transactions' },
  'billing.order': { ru: '№ заказа', en: 'Order #' },
  'billing.date': { ru: 'Дата', en: 'Date' },
  'billing.provider': { ru: 'Провайдер', en: 'Provider' },
  'billing.amount': { ru: 'Сумма', en: 'Amount' },
  'billing.status': { ru: 'Статус', en: 'Status' },
  'billing.credited': { ru: 'Зачислено', en: 'Credited' },
  'billing.pending': { ru: 'Ожидание', en: 'Pending' },
  'billing.error': { ru: 'Ошибка', en: 'Error' },

  // ── Plan names & features ─────────────────────────────────────────────────
  'plan.start': { ru: 'Старт', en: 'Start' },
  'plan.business': { ru: 'Бизнес', en: 'Business' },
  'plan.start_features': { ru: '1 eSIM профиль|VPN базовый (подключить отдельно)|1 виртуальная карта', en: '1 eSIM profile|Basic VPN (add separately)|1 virtual card' },
  'plan.pro_features': { ru: 'VPN Pro включён (50+ серверов)|3 eSIM профиля|3 виртуальные карты|Приоритетная поддержка', en: 'VPN Pro included (50+ servers)|3 eSIM profiles|3 virtual cards|Priority support' },
  'plan.business_features': { ru: 'VPN безлимит включён|10 eSIM профилей|10 виртуальных карт|API доступ', en: 'Unlimited VPN included|10 eSIM profiles|10 virtual cards|API access' },

  // ── Topup ─────────────────────────────────────────────────────────────────
  'topup.back': { ru: '← Назад', en: '← Back' },
  'topup.title': { ru: 'Пополнить баланс', en: 'Top Up Balance' },
  'topup.vpn_auto': { ru: 'После оплаты VPN активируется автоматически', en: 'VPN activates automatically after payment' },
  'topup.instant': { ru: 'Мгновенное зачисление после оплаты', en: 'Instant credit after payment' },
  'topup.error': { ru: 'Ошибка создания платежа', en: 'Payment creation error' },
  'topup.amount_label': { ru: 'Сумма пополнения', en: 'Top-up amount' },
  'topup.method': { ru: 'Способ оплаты', en: 'Payment method' },
  'topup.limit': { ru: 'Лимит:', en: 'Limit:' },
  'topup.open_payment': { ru: 'Открыть страницу оплаты', en: 'Open payment page' },

  // ── Topup result ──────────────────────────────────────────────────────────
  'topup.success': { ru: 'Оплата прошла', en: 'Payment successful' },
  'topup.failed': { ru: 'Оплата не прошла', en: 'Payment failed' },
  'topup.credited': { ru: 'Средства зачислены на ваш баланс. Спасибо!', en: 'Funds credited to your balance. Thank you!' },
  'topup.failed_desc': { ru: 'Что-то пошло не так. Попробуйте ещё раз или выберите другой способ оплаты.', en: 'Something went wrong. Try again or choose a different payment method.' },
  'topup.activate_vpn': { ru: 'Активировать VPN вручную', en: 'Activate VPN manually' },
  'topup.try_again': { ru: 'Попробовать снова', en: 'Try again' },
  'topup.go_balance': { ru: 'Перейти к балансу', en: 'Go to balance' },
  'topup.cancel': { ru: 'Отмена', en: 'Cancel' },
  'topup.activation_error': { ru: 'Ошибка активации', en: 'Activation error' },

  // ── Referrals ─────────────────────────────────────────────────────────────
  'ref.title': { ru: 'Приведи друга', en: 'Refer a Friend' },
  'ref.desc': { ru: 'За каждого друга, который оплатит первый месяц — ты получаешь +1 месяц VPN бесплатно', en: 'For every friend who pays their first month, you get +1 month of VPN free' },
  'ref.your_link': { ru: 'Твоя реферальная ссылка', en: 'Your referral link' },
  'ref.copied': { ru: 'Скопировано', en: 'Copied' },
  'ref.copy': { ru: 'Копировать', en: 'Copy' },
  'ref.how_it_works': { ru: 'Как это работает', en: 'How it works' },
  'ref.step1': { ru: 'Поделись ссылкой с другом — в Telegram, WhatsApp или любым способом', en: 'Share your link with a friend — via Telegram, WhatsApp, or any way you like' },
  'ref.step2': { ru: 'Друг регистрируется по твоей ссылке и получает доступ к IMBA', en: 'Your friend signs up using your link and gets access to IMBA' },
  'ref.step3': { ru: 'Когда друг оплачивает первый месяц — ты автоматически получаешь +1 месяц VPN', en: 'When they pay their first month, you automatically get +1 month of VPN' },
  'ref.flow': { ru: 'Друг переходит по ссылке → регистрируется → оплачивает первый месяц → ты получаешь +1 месяц VPN', en: 'Friend clicks link → signs up → pays first month → you get +1 month VPN' },
  'ref.total': { ru: 'Всего друзей', en: 'Total friends' },
  'ref.paid': { ru: 'Оплатили', en: 'Paid' },
  'ref.pending_stat': { ru: 'Ожидают', en: 'Pending' },

  // ── Notifications ─────────────────────────────────────────────────────────
  'notif.just_now': { ru: 'только что', en: 'just now' },
  'notif.mark_read': { ru: 'Прочитать все', en: 'Mark all read' },
  'notif.empty': { ru: 'Нет новых уведомлений', en: 'No new notifications' },

  // ── Trial block ───────────────────────────────────────────────────────────
  'trial.heading': { ru: '7 дней вокруг света', en: '7 days around the world' },
  'trial.desc': { ru: 'Выбери ВКонтакте или Telegram, подпишись на наши соцсети и активируй IMBA Старт: VPN и eSIM 500 МБ на 7 дней!', en: 'Follow us on Telegram and activate IMBA Start: VPN + 500 MB eSIM for 7 days!' },
  'trial.vk': { ru: 'ВКонтакте', en: 'VKontakte' },
  'trial.vk_done': { ru: 'Вступи в группу — триал придёт автоматически ✓', en: 'Join the group — trial activates automatically ✓' },
  'trial.vk_auth_done': { ru: 'Авторизация пройдена — вступи в группу', en: 'Auth complete — join the group' },
  'trial.vk_join': { ru: 'Вступи в сообщество IMBA', en: 'Join the IMBA community' },
  'trial.tg_loading': { ru: 'Открываем бота…', en: 'Opening bot…' },
  'trial.tg_done': { ru: 'Подпишись на канал в боте — триал придёт автоматически ✓', en: 'Subscribe in the bot — trial activates automatically ✓' },
  'trial.tg_subscribe': { ru: 'Подпишись на канал IMBA', en: 'Subscribe to IMBA channel' },
  'trial.promo_placeholder': { ru: 'Промокод', en: 'Promo code' },
  'trial.apply': { ru: 'Применить', en: 'Apply' },
  'trial.invalid_promo': { ru: 'Неверный промокод', en: 'Invalid promo code' },
  'trial.vk_auth_error': { ru: 'Ошибка VK авторизации', en: 'VK auth error' },
  'trial.network_error': { ru: 'Ошибка сети', en: 'Network error' },
  'trial.error': { ru: 'Ошибка', en: 'Error' },

  // ── Social verify ─────────────────────────────────────────────────────────
  'social.vk_auth_first': { ru: 'Сначала авторизуйся через VK', en: 'Sign in with VK first' },
  'social.not_joined': { ru: 'Ты ещё не вступил в группу. Вступи и попробуй снова.', en: "You haven't joined the group yet. Join and try again." },
  'social.activation_error': { ru: 'Ошибка активации', en: 'Activation error' },
  'social.join_vk': { ru: 'Вступи в сообщество VK', en: 'Join our VK community' },
  'social.open_vk': { ru: 'Открыть группу IMBA ВКонтакте', en: 'Open IMBA VK group' },
  'social.after_join': { ru: 'После вступления нажми кнопку ниже', en: 'After joining, click the button below' },
  'social.checking': { ru: 'Проверяем…', en: 'Checking…' },
  'social.verify_btn': { ru: 'Я вступил → Активировать VPN', en: 'I joined → Activate VPN' },
  'social.cta': { ru: 'Вступи в VK-сообщество или Telegram-канал — и получи 7 дней VPN + eSIM 500 МБ', en: 'Join our VK or Telegram — get 7 days VPN + 500 MB eSIM' },

  // ── Phone verify ──────────────────────────────────────────────────────────
  'phone.sms_error': { ru: 'Ошибка отправки SMS', en: 'SMS sending error' },
  'phone.wrong_code': { ru: 'Неверный код', en: 'Wrong code' },
  'phone.desc': { ru: 'Подтверди номер телефона → получи 7 дней VPN + eSIM 500 МБ бесплатно', en: 'Verify phone → get 7 days VPN + 500 MB eSIM free' },
  'phone.get_code': { ru: 'Получить код', en: 'Get code' },
  'phone.change_number': { ru: 'Изменить номер', en: 'Change number' },

  // ── Telegram verify ───────────────────────────────────────────────────────
  'tg.link_error': { ru: 'Ошибка привязки Telegram', en: 'Telegram linking error' },
  'tg.desc': { ru: 'Подтверди Telegram → получи 7 дней VPN + eSIM 500 МБ бесплатно', en: 'Verify Telegram → get 7 days VPN + 500 MB eSIM free' },
  'tg.activating': { ru: 'Активируем…', en: 'Activating…' },

  // ── VPN servers panel ─────────────────────────────────────────────────────
  'vpn.happ_heading': { ru: 'Happ — ссылка подписки', en: 'Happ — subscription link' },
  'vpn.download_happ': { ru: 'Скачай <strong>Happ</strong>:', en: 'Download <strong>Happ</strong>:' },
  'vpn.mirror': { ru: 'Зеркало', en: 'Mirror' },
  'vpn.not_in_store': { ru: 'В RU App Store и Google Play нет — используй APK или зарубежный аккаунт.', en: 'Use APK or a non-RU store account.' },
  'vpn.happ_step1': { ru: 'Открой Happ → нажми «+» → «Добавить подписку» → вставь ссылку выше', en: 'Open Happ → tap "+" → "Add subscription" → paste the link above' },
  'vpn.happ_mux': { ru: 'Зайди в настройки сервера → найди Mux → выключи', en: 'Go to server settings → find Mux → disable it' },
  'vpn.happ_connect': { ru: 'Нажми Подключить — готово!', en: 'Tap Connect — done!' },
  'vpn.happ_mux_warning': { ru: '⚠️ Mux обязательно отключить в настройках сервера — иначе VPN не работает.', en: '⚠️ Mux must be disabled in server settings — otherwise VPN won\'t work.' },
  'vpn.happ_full_guide': { ru: 'Полная инструкция по настройке Happ', en: 'Full Happ setup guide' },
  'vpn.wl_heading': { ru: 'WhiteList Unblocker — инструкция', en: 'WhiteList Unblocker — guide' },
  'vpn.wl_desc': { ru: '✓ Трафик идёт через VK — оператор видит звонок ВКонтакте, не VPN', en: '✓ Traffic goes through VK — ISP sees a VK call, not VPN' },

  // ── WDTT instructions ──────────────────────────────────────────────────────
  'wdtt.download_android': { ru: 'Скачай <strong>qWDTT</strong> для Android:', en: 'Download <strong>qWDTT</strong> for Android:' },
  'wdtt.download_apk': { ru: 'Скачать APK', en: 'Download APK' },
  'wdtt.allow_unknown': { ru: 'Разреши установку из неизвестных источников', en: 'Allow installation from unknown sources' },
  'wdtt.import_link': { ru: 'В приложении нажми <strong>«Импорт ссылки»</strong> и вставь:', en: 'In the app tap <strong>"Import link"</strong> and paste:' },
  'wdtt.tap_connect': { ru: 'Нажми <strong>Подключить</strong>', en: 'Tap <strong>Connect</strong>' },
  'wdtt.install_ios': { ru: 'Установи <strong>VK Turn Proxy</strong> через TestFlight:', en: 'Install <strong>VK Turn Proxy</strong> via TestFlight:' },
  'wdtt.open_testflight': { ru: 'Открыть в TestFlight', en: 'Open in TestFlight' },
  'wdtt.ios_import': { ru: 'Нажми <strong>«Import from connection link»</strong> и вставь:', en: 'Tap <strong>"Import from connection link"</strong> and paste:' },
  'wdtt.tap_connect_en': { ru: 'Нажми <strong>Connect</strong>', en: 'Tap <strong>Connect</strong>' },
  'wdtt.download_win': { ru: 'Скачай <strong>wdtt.exe</strong> для Windows:', en: 'Download <strong>wdtt.exe</strong> for Windows:' },
  'wdtt.download_exe': { ru: 'Скачать wdtt.exe', en: 'Download wdtt.exe' },
  'wdtt.paste_link_win': { ru: 'Запусти и вставь ссылку в поле <strong>«WDTT Link»</strong>:', en: 'Launch and paste the link into <strong>"WDTT Link"</strong> field:' },
  'wdtt.download_macos': { ru: 'Скачай клиент для macOS:', en: 'Download client for macOS:' },
  'wdtt.open_terminal': { ru: 'Открой терминал в папке с файлом и запусти:', en: 'Open terminal in the file directory and run:' },
  'wdtt.sudo_note': { ru: 'Нужен sudo — создаёт WireGuard-интерфейс', en: 'Requires sudo — creates a WireGuard interface' },
  'wdtt.allow_vpn_macos': { ru: 'В системных настройках разреши VPN — трафик пойдёт через VK', en: 'Allow VPN in System Settings — traffic goes through VK' },
  'wdtt.download_linux': { ru: 'Скачай <strong>PWDTT</strong> для Linux:', en: 'Download <strong>PWDTT</strong> for Linux:' },
  'wdtt.download_amd64': { ru: 'Скачать (amd64)', en: 'Download (amd64)' },
  'wdtt.chmod_run': { ru: 'Дай права и запусти, затем вставь ссылку в <strong>«Import link»</strong>:', en: 'Set permissions and run, then paste the link into <strong>"Import link"</strong>:' },
  'wdtt.connect_tray': { ru: 'Нажми <strong>Connect</strong> в трее', en: 'Click <strong>Connect</strong> in the system tray' },

  // ── v2box ─────────────────────────────────────────────────────────────────
  'v2box.heading': { ru: 'v2box — прямой конфиг', en: 'v2box — direct config' },
  'v2box.step1': { ru: '1. Скачай <strong>v2box</strong> (iOS / Android / Desktop)', en: '1. Download <strong>v2box</strong> (iOS / Android / Desktop)' },
  'v2box.step2_vless': { ru: '2. Открой → «+» → «Импорт из буфера» — или вставь ссылку выше вручную', en: '2. Open → "+" → "Import from clipboard" — or paste the link above manually' },
  'v2box.step3_vless': { ru: '3. Подключись к <strong>🇵🇹 Лиссабон</strong>', en: '3. Connect to <strong>🇵🇹 Lisbon</strong>' },
  'v2box.step2_sub': { ru: '2. Открой → «Добавить подписку» → вставь ссылку выше', en: '2. Open → "Add subscription" → paste the link above' },
  'v2box.step3_sub': { ru: '3. Выбери сервер <strong>🇵🇹 Лиссабон</strong> (не Happ)', en: '3. Select server <strong>🇵🇹 Lisbon</strong> (not Happ)' },

  // ── Install prompt ────────────────────────────────────────────────────────
  'install.heading': { ru: 'Добавить IMBA на экран', en: 'Add IMBA to home screen' },
  'install.desc': { ru: 'Как приложение — без браузера', en: 'Like an app — no browser needed' },
  'install.add': { ru: 'Добавить', en: 'Add' },

  // ── Copy button ───────────────────────────────────────────────────────────
  'copy.copied': { ru: 'Скопировано', en: 'Copied' },
  'copy.copy': { ru: 'Копировать', en: 'Copy' },

  // ── Currency names ────────────────────────────────────────────────────────
  'currency.usd': { ru: 'Доллар', en: 'US Dollar' },
  'currency.eur': { ru: 'Евро', en: 'Euro' },
  'currency.rub': { ru: 'Рубль', en: 'Ruble' },

  // ── Node diagnostics ─────────────────────────────────────────────────────
  'diag.refresh_prompt': { ru: 'Нажми Refresh для диагностики', en: 'Click Refresh to diagnose' },
  'diag.traffic': { ru: 'Трафик', en: 'Traffic' },
  'diag.used': { ru: 'использовано', en: 'used' },
  'diag.last_change': { ru: 'Последнее изменение', en: 'Last change' },
  'diag.load_prompt': { ru: 'Нажми Refresh для загрузки отчёта', en: 'Click Refresh to load report' },

  // ── Auth buttons ──────────────────────────────────────────────────────────
  'auth.vk_login': { ru: 'Войти через VK ID', en: 'Sign in with VK' },
  'auth.tg_login': { ru: 'Войти через Telegram', en: 'Sign in with Telegram' },
  'auth.vk_error': { ru: 'VK ошибка', en: 'VK error' },

  // ── Support widget ────────────────────────────────────────────────────────
  'support.title': { ru: 'Поддержка IMBA', en: 'IMBA Support' },
  'support.subtitle': { ru: 'Обычно отвечаем быстро', en: 'We usually reply fast' },
  'support.aria': { ru: 'Поддержка', en: 'Support' },
  'support.loading': { ru: 'Загрузка…', en: 'Loading…' },
  'support.greeting': { ru: 'Что-то сломалось?', en: 'Something broken?' },
  'support.greeting_sub': { ru: 'Опиши проблему — и мы разберёмся.', en: 'Describe the issue and we’ll sort it out.' },
  'support.placeholder': { ru: 'Опиши проблему…', en: 'Describe the issue…' },
  'support.send_error': { ru: 'Не удалось отправить сообщение. Попробуй ещё раз.', en: 'Could not send the message. Please try again.' },
} as const

export type TKey = keyof typeof dict

export function t(key: TKey, locale: Locale): string {
  return dict[key]?.[locale] ?? dict[key]?.en ?? key
}

export function useT(locale: Locale) {
  return (key: TKey) => t(key, locale)
}
