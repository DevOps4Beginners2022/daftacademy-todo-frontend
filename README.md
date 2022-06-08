# daftacademy-todo-frontend

Repozytorium zawiera kod źródłowy frontendu, który został wydzielony z repozytorium [DevOps-4-Beginners-2022](https://github.com/DevOps4Beginners2022/DevOps-4-Beginners-2022), żeby ułatwić proces wdrożenia na [heroku](https://heroku.com).


## Lista kroków do wykonania

### Deployment aplikacji na heroku
1. Zakładam, ze wykonałeś juz konfiguracje API, wiec masz równiez skonfigurowane konto na heroku.
2. Utwórz plik heroku.yml z sekcją `build`, która wskaże plik Dockerfile, na podstawie, którego obraz naszej aplikacji zostanie zbudowany. Do tego przekazemy zmienną REACT_APP_API_URL, która będzie wskazywała na adres wcześniej zdeployowanego API. 

```yaml
build:
  docker:
    web: Dockerfile
  config:
    REACT_APP_API_URL: "https://daftacademy-todo-backend-xyz.herokuapp.com/" # adres do backendu mozesz sprawdzic w dashboardzie lub za pomoca heroku apps:info -a daftacademy-todo-backend-xyz

```

3. Utwórzmy aplikacje heroku na podstawie pliku heroku.yml `heroku create daftacademy-todo-frontend-xyz --manifest --region eu`. Pamiętaj, ze nazwa aplikacji musi być unikalna.

4. Jesteśmy gotowi do wdrozenia frontendu. Dodajmy nasze zmiany do repozytorium: 
```bash
git add heroku.yml
git commit -m "Add heroku.yml
```
Następnie wrzućmy nasze zmiany na zdalne repozytorium heroku, zeby uruchomić proces budowania i wdrozenia naszej aplikacji:
```bash
git push heroku main
```
5. Zastanawiasz się dlaczego pomineliśmy sekcje `run`? Wynika to z tego, ze domyślnie heroku uruchamia obraz web z komendą, która jest w Dockerfile, więc w naszym przypadku mogliśmy to pominąć. 
6. Po zakończonym budowaniu i wdrozeniu mozesz podejrzec logi naszej aplikacji za pomocą `heroku logs --tails`.

> **UWAGA:**
> Jeśli, któryś z etapów nie jest dla ciebie jasny rzuć okiem na [dokumentacje](https://devcenter.heroku.com/articles/build-docker-images-heroku-yml).

### Konfiguracja CI/CD za pomocą Github Actions

1. Skopiuj API KEY z [ustawień konta heroku](https://dashboard.heroku.com/account) i skonfiguruj sekret o nazwie  HEROKU_API_KEY w konfigiracji repozytorium na githubie.

2. Utwórz plik main.yml w katalogu .github/workflows/main.yml

`mkdir -p .github/workflows && touch .github/workflows/main.yml`

3. Dodaj konfigurację, która umozliwi deploy aplikacji na heroku. W tym celu skorzystamy z gotowej akcji z marketplace: https://github.com/marketplace/actions/deploy-to-heroku

```yaml
name: Test CI/CD

on:
  push:
    branches:
      - main

jobs:
  deploy-to-heroku:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}} # Skopiuj API KEY ze swojego konta heroku i dodaj je jako sekret w projekcie
          heroku_app_name: "xxxxx" # Wpisz nazwe swojej aplikacji
          heroku_email: "xxxxx" # Wpisz swój adres email

```
4. Wprowadź zmiany w projekcie, dzięki którym poznasz wersje aplikacji, zacommituj je, a następnie wypchnij commity do repozytorium githuba. 

5. Skonfiguruj workflow w ten sposób, zeby pipeline uruchamiał się tylko, jeśli tag zaczynający się na literę "v" zostanie dodany do repozytorium.

Zmień fragment:
```yaml
on:
  push:
    branches:
      - main

```
na:

```yaml
on:
  push:
    tags:        
      - v**
```

6. Dodaj kolejny job, dzięki któremy zbudujemy obraz i dodamy go do repozytrium githuba.

Dodaj dodatkowe zmienne środowiskowe:

```yaml
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
```

Dodaj job:

```yaml
  build-and-push-image:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Log in to the Container registry
        uses: docker/login-action@f054a8b539a109f9f41c372932f1ae047eff08c9
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@98669ae865ea3cffbcbaa878cf57c20bbf1c6c38
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

      - name: Build and push Docker image
        uses: docker/build-push-action@ad44023a93711e3deb337508980b4b5e9bcdc5dc
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

Dodatkowo zmieńmy konfiguracje joba do deployu, dzięki której job wykona się tylko jeśli build-and-push-image wykona się poprawnie.
Wystarczy dodać ponizszy klucz:
```yaml
  needs: [build-and-push-image]
```
> **UWAGA:**
> Jeśli, któryś z etapów nie jest dla ciebie jasny rzuć okiem na [dokumentacje](https://docs.github.com/en/actions).