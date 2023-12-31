<h1>
  СЕРВИС АВТОМАТИЧЕСКОГО РАСПРЕДЕЛЕНИЯ ЗАДАЧ ДЛЯ ВЫЕЗДНЫХ СОТРУДНИКОВ БАНКА
</h1>
<h2>by Al Knowledge Club MISIS</h2>

<a href = "https://misis1.ru/"> Протестировать сайт </a>

![Screenshot 2023-11-11 at 23-54-42 Screenshot](https://github.com/Dikower/TaskAllocator/assets/32881349/3f60e62b-cc3f-43f0-9fbb-36f076d5b4c8)

## ✍️ Оглавнение

- [🐳 Запуск с помощью докера](https://github.com/Dikower/SceneDescriptor/edit/master/readme.md#-запуск-с-помощью-докера)
- 📎 Презентация [![Download zip](https://custom-icon-badges.herokuapp.com/badge/-Download-blue?style=for-the-badge&logo=download&logoColor=white "Download zip")](https://github.com/Dikower/TaskAllocator/blob/master/files/Presentation.pdf)

## 🐳 Запуск с помощью докера

Соберите образ и запустите при помощи docker-compose

```bash
docker-compose up --build
```

## Локальный запуск

```
npm i
```

Запустите сервер разработки:

```
npm run dev
```

или запустите сервер и откройте приложение в новой вкладке браузера

```
npm run dev -- --open
```

## Сборка

Чтобы создать продакшн-версию приложения:

```
npm run build
```

Вы можете предварительно просмотреть сборку для продакшн с помощью ```npm run preview```.

> Для развертывания вашего приложения может потребоваться установка [адаптера](https://kit.svelte.dev/docs/adapters) для вашей целевой среды.
