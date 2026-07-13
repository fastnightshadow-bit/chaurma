# Шаурма №1 Халял

Одностраничный mobile-first сайт двух точек сети в Ярославле. Пользователь может посмотреть меню, собрать корзину, позвонить заведению, показать заказ продавцу и построить маршрут.

## Запуск

Требования: Node.js 20+ и pnpm 10.

```bash
pnpm install
pnpm dev
```

Сайт будет доступен по адресу `http://localhost:3000`.

## Данные

Редактируемые данные находятся в:

- `src/data/menu.ts`
- `src/data/locations.ts`
- `src/data/siteConfig.ts`

Перед публикацией нужно проверить пункты из `OWNER_CHECKLIST.md`. Тестовые значения не следует выдавать за подтверждённые данные владельца.

## Проверки

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```
