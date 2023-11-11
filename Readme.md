# Vidyo AI Recruitment Project Submission

Thanks for the amazing assignment. I had quite a lot of fun doing it.

## Installation Instructions

### Dependencies

The following are required to be installed as pre-requisites. The rest of the installation instructions assume the following tools are correctly setup and running on your machine.

- React, node, npm
- Docker

### How to Run?

#### Frontend

```sh
cd <project_dir>/frontend
npm i
npm run start
```

⚠️**WARNING**: Run the frontend from the domain and port [http://localhost:3000](http://localhost:3000) only, otherwise there might be some CORS errors.

#### Backend

The backend server runs on port 8000.

```sh
cd <project_dir>/server
docker-compose up
```

This might take a while :). Once the containers are up, in another terminal apply migrations and collect static files.

```sh
docker-compose exec web python manage.py collectstatic # enter "yes" if prompted to overwrite existing files

docker-compose exec web python manage.py migrate
```

Finally create an admin account to access the Django admin panel. Keep the credentials set here handy as they are required to log in the aforementioned admin panel.

```sh
docker-compose exec web python manage.py createsuperuser
```

Just to make sure there are no surprises, I would recommend restarting the app at this point. `ctrl+c` on the docker-compose terminal to shut down the running containers. Then start them up again,

```sh
docker-compose up
```

Once done visit [localhost:8000/admin](http://localhost:8000/admin) and you can login with the superuser account just created. I recommend using it to explore different models I have created in this assignment.

Now you can go to [localhost:3000](http://localhost:3000) to test the project.

## Tasks Performed

### Backend Tasks

- A dockerized PostgreSQL database has been integrated.
- Four core models have been created: `Video`, `Audio`, `VideoWatermarkingTask`, `AudioExtractionTask` ([ERD here](./er_diagram.pdf)).
- [Celery](https://docs.celeryq.dev/en/stable/index.html) is used for scheduling jobs as background tasks.
- Django Rest Framework has been used to develop REST API endpoints.
- You can view the api schema at [localhost:8000/swagger](http://localhost:8000/api/schema/swagger/), or [localhost:8000/redoc](http://localhost:8000/api/schema/redoc/)
- Inheritance has been used (in addition to general use of inheritance in Django) wherever found beneficial. For instance, both `VideoWatermarkingTask` and `AudioExtractionTask` models inherit from an abstract `Task` model.
- I have strived to maintain a clean and consistent folder structure. Of course, Django defaults helped in this endeavor.
- A POST request at `/api/audio-tasks/`, and at `/api/watermark-tasks/` does audio extraction and watermarking respetively. Both the operations use FFMPEG.

### Containerization Tasks

Four docker containers are run by the compose script:

- `web`: This runs the python Django app`
- `db`: This is the PostgreSQL DB
- `celery`: This runs the background processing workers
- `redis`: This is a dependency of celery. It is used as a queue for pending jobs untill they are consumed by a worker.

I have tried to optimize the size of the final docker image (~1.4GB -> ~650MB) by removing packages and lists that were only needed for installation of dependencies.

### Frontend Tasks

Becaue of the time constraints and as this was a backend assignment the frontend developed for this project is by no means the finest I have made. You can look at [my website](https://sahej.io) as a humble proof of that (I like to think it's fairly decent.)

- A canvas based video player with a play/pause button.
- I have used the [p5.js](https://p5js.org/) canvas library because I was already familiar with it from my early days of programming.
- A watermark can be displayed on top of the video on the canvas. It can be dragged around to change it's location.
- tailwindCSS along with daisyUI was used for quick styling.
