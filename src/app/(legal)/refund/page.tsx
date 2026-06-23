import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Возврат средств — IMBA',
  description: 'Описание процедуры возврата денежных средств сервиса IMBA.',
}

export default function RefundPage() {
  return (
    <article className="prose-legal">
      <h1 className="display text-3xl md:text-4xl mb-2">Возврат денежных средств</h1>
      <p className="text-ink/50 text-sm mb-8">Описание процедуры возврата денежных средств</p>

      <h2>Основные положения</h2>
      <p>
        Клиент имеет право запросить возврат денежных средств за неиспользованные услуги.
        Возврат осуществляется на тот же способ оплаты, который был использован при оформлении заказа.
      </p>

      <h2>Как оформить возврат</h2>
      <p>
        Для оформления возврата необходимо обратиться в службу поддержки и указать:
      </p>
      <ul>
        <li>номер заказа;</li>
        <li>причину запроса на возврат.</li>
      </ul>
      <p>
        Контакт для обращений:{' '}
        <a href="mailto:hello@imba.live" className="text-blue font-bold hover:underline">hello@imba.live</a>
      </p>

      <h2>Порядок возврата</h2>
      <ul>
        <li>Возврат возможен только после полной остановки и отмены услуги.</li>
        <li>Заявка на возврат рассматривается в течение <strong>до 5 рабочих дней</strong>.</li>
        <li>После одобрения заявки возврат денежных средств осуществляется в течение <strong>до 14 календарных дней</strong>.</li>
        <li>Денежные средства возвращаются на те же платёжные реквизиты, с которых была произведена оплата.</li>
      </ul>

      <h2>Дополнительная информация</h2>
      <p>
        Администрация оставляет за собой право запросить дополнительную информацию, необходимую
        для обработки заявки на возврат.
      </p>
      <p>
        С подробными условиями оказания услуг и возврата денежных средств можно ознакомиться
        в{' '}<a href="/terms" className="text-blue font-bold hover:underline">публичной оферте</a>.
      </p>

      <style>{`
        .prose-legal h2 {
          font-size: 1.15rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 0.5rem;
        }
        .prose-legal p {
          margin-bottom: 0.75rem;
          line-height: 1.7;
          color: rgba(17,17,17,0.8);
        }
        .prose-legal ul {
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
          list-style: disc;
        }
        .prose-legal li {
          margin-bottom: 0.35rem;
          line-height: 1.6;
          color: rgba(17,17,17,0.8);
        }
      `}</style>
    </article>
  )
}
