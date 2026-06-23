import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Возврат средств — IMBA',
  description: 'Описание процедуры возврата денежных средств сервиса IMBA.',
}

export default function RefundPage() {
  return (
    <article className="prose-legal">
      <h1 className="display text-3xl md:text-4xl mb-2">Возврат средств</h1>
      <p className="text-ink/50 text-sm mb-8">Описание процедуры возврата денежных средств</p>

      <h2>Основы</h2>
      <p>
        Клиент имеет право вернуть средства за неиспользованные услуги в полном объёме. Возврат
        производится автоматически на те же реквизиты, с которых была произведена оплата.
      </p>

      <h2>Как оформить возврат</h2>
      <p>
        Для оформления возврата необходимо создать тикет в службу поддержки, указав:
      </p>
      <ul>
        <li>номер заказа для отмены;</li>
        <li>причину отказа.</li>
      </ul>

      <p>
        Обратитесь в поддержку:{' '}
        <a href="mailto:hello@imba.live" className="text-blue font-bold hover:underline">hello@imba.live</a>
      </p>

      <h2>Сроки</h2>
      <ul>
        <li>возврат производится только после полной остановки услуги (отмены);</li>
        <li><strong>срок подачи заявки на возврат — 3 дня с момента оплаты;</strong></li>
        <li><strong>срок рассмотрения заявки — 5 рабочих дней;</strong></li>
        <li><strong>срок осуществления возврата — 5 рабочих дней с момента одобрения;</strong></li>
        <li>возврат производится на те же реквизиты, с которых была произведена оплата.</li>
      </ul>

      <p>
        С полным описанием правил возврата вы можете ознакомиться на странице{' '}
        <a href="/terms" className="text-blue font-bold hover:underline">публичной оферты</a>.
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
