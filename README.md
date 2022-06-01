# daftacademy-todo-frontend

Repozytorium zawiera kod źródłowy frontendu, który został wydzielony z repozytorium [DevOps-4-Beginners-2022](https://github.com/DevOps4Beginners2022/DevOps-4-Beginners-2022), żeby ułatwić proces wdrożenia na [heroku](https://heroku.com).


## Lista kroków do wykonania

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