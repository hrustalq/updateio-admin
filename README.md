# React + TypeScript + Vite SWC + Shadcn/UI + TailwindCSS + Tanstack Query + Tanstack Router starter kit

Минимальный набор для разработки на React.  

- Внесены мелкие правки в текущую реализацию базовых ui компонентов библиотеки shadcn/ui, а также добавлены новые компоненты, подключен dark mode и добавлен theme provider.

- [Code-based](https://tanstack.com/router/latest/docs/framework/react/guide/code-based-routing) роутинг реализован на основе библиотеки tanstack/router.

## Используемые технологии

- [React](https://reactjs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [SWC](https://swc.rs/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Tanstack Query](https://tanstack.com/query)
- [Tanstack Router](https://tanstack.com/router)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Структура проекта

```
src/
  assets/
    - статические файлы
  components/
    ui/
      - ui компоненты
  context/
      - контексты
  hooks/
      - хуки
  lib/
      - библиотека функций
  providers/
      - провайдеры
  routes/
      - роуты (имлепентация react-router, компоненты страниц)
  main.tsx
      - точка входа
  global.css
      - глобальные стили
  router.tsx
      - роутинг
  vite-env.d.ts
      - типы для vite
```

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

## Линтер

```bash
npm run lint
```
