# SPS: Driver Web
## Ссылки
Стенд: http://84.38.183.39 <br>
Докер: https://hub.docker.com/r/ermolaev10/sps-driver-web <br>
Релизы: https://github.com/Mind-team/smart-parking-system-driver-web/releases <br>
Трекер: https://github.com/Mind-team/smart-parking-system-driver-web/issues <br>
Версии: https://github.com/Mind-team/smart-parking-system-driver-web/milestones <br>

## Установка
### Без докера
1. Установить [node v16](https://nodejs.org/en/)
2. Клонировать репозиторий
3. В корне проекта прописать `npm i`
4. Прописать команду `npm run start`
5. Посетить localhost:3000

### Докер
1. Установить [docker](https://www.docker.com/get-started/)
2. Выполнить команду `docker pull ermolaev10/sps-driver-web`
3. Выполнить команду `docker run -p 127.0.0.1:80:80/tcp ermolaev10/sps-driver-web`
4. Посетить http://127.0.0.1
