#  Spotify Extended Streaming History Analyzer

Hej! Jestem **Ksero**, a to jest skrypt, który wyciąga najciekawsze statystyki na podstawie Twojej paczki danych ze Spotify.

Skrypt analizuje **Spotify Extended Streaming History** i prezentuje m.in. najczęściej słuchane utwory, wykonawców i albumy, czas słuchania, statystyki roczne oraz wykresy.

---

##  Jak zdobyć swoją paczkę danych Spotify?

Aby użyć skryptu, potrzebujesz danych z **rozszerzonej historii odtwarzania Spotify**.

1. Wejdź na stronę [Ustawienia prywatności Spotify](https://www.spotify.com/pl/account/privacy/).
2. Zaloguj się na swoje konto Spotify.
3. Przewiń stronę na sam dół do sekcji **Pobierz swoje dane**.
4. Zaznacz pole **Plik z rozszerzoną historią odtwarzania**.
   > Obsługa pozostałych paczek danych może zostać dodana w przyszłości.
5. Kliknij **Poproś o dostęp do danych**.
6. Poczekaj na wiadomość e-mail z przygotowanymi danymi. Może to potrwać kilka dni.
7. Po otrzymaniu wiadomości pobierz przygotowaną paczkę danych.

---

##  Wymagania

Do uruchomienia skryptu potrzebujesz:

- **Node.js**
- pobranej paczki **Spotify Extended Streaming History**

Skrypt korzysta wyłącznie z wbudowanych modułów Node.js, dlatego **nie trzeba instalować żadnych dodatkowych paczek npm**.

---

## 🐧 Linux

Jeśli korzystasz z Linuksa, możesz zainstalować Node.js ze [strony oficjalnej Node.js](https://nodejs.org/en/download) albo użyć menedżera pakietów swojej dystrybucji.

---

## 🪟 Windows

Na Windowsie możesz:

- pobrać Node.js ręcznie ze [strony oficjalnej Node.js](https://nodejs.org/en/download), **lub**
- użyć dołączonego skryptu `install-node.bat`.

### Instalacja za pomocą `install-node.bat`

1. Kliknij dwukrotnie plik `install-node.bat`.
2. Skrypt sprawdzi, czy Node.js jest już zainstalowany, używając:
   ```cmd
   node --version
   ```
3. Jeśli Node.js nie jest zainstalowany, skrypt sprawdzi obecność `winget`, czyli menedżera pakietów Windows.
4. Następnie `winget` zainstaluje wersję **Node.js LTS** za pomocą polecenia:
   ```cmd
   winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
   ```
5. Po zakończeniu instalacji **otwórz nowe okno CMD / Terminala**, aby system odświeżył zmienną `PATH`.
6. Przejdź do folderu zawierającego skrypt i uruchom go:
   ```cmd
   node script.js
   ```
7. Skrypt zapyta, ile pozycji ma wyświetlać w zestawieniach TOP. Wpisz wybraną liczbę i naciśnij `Enter`.

   **Najprościej wpisać `5`.**

---

## Ważne — struktura folderów

Skrypt musi znajdować się **bezpośrednio obok** folderu:

```text
Spotify Extended Streaming History
```

Przykładowa struktura powinna wyglądać tak:

```text
📁 Mój folder
├── 📄 script.js
├── 📄 install-node.bat
└── 📁 Spotify Extended Streaming History
    ├── 📄 Streaming_History_Audio_XXXX.json
    ├── 📄 Streaming_History_Audio_XXXX.json
    ├── 📄 Streaming_History_Video_XXXX.json
    ├── 📄 Streaming_History_Video_XXXX.json
    └── 📄 *.pdf
```

> **⚠️ Nie zmieniaj nazw plików JSON ani ich nie modyfikuj.**

Plików historii może być dużo — jest to normalne. Spotify dzieli historię na kilka plików.

Znajdujący się w paczce plik PDF **nie wpływa na działanie skryptu** i może pozostać w folderze.

---

## Uruchomienie

Po przygotowaniu folderów wystarczy uruchomić:

```cmd
node script.js
```

Następnie skrypt zapyta:

```text
Ile piosenek w topkach wyświetlić?
```

Wpisz liczbę, np.:

```text
5
```

i zatwierdź klawiszem `Enter`.

---

# Co analizuje skrypt?

## 1. All Time

Sekcja **All Time** pokazuje statystyki z całej dostępnej historii.

Znajdziesz tutaj TOP najczęściej słuchanych:

-  **utworów**
- **wykonawców**
- **albumów**

Liczba pozycji w TOP zależy od wartości podanej podczas uruchamiania skryptu.

---

## 2. General Statistics

Sekcja **General Statistics** zawiera ogólne statystyki słuchania:

- całkowity czas słuchania muzyki,
- całkowity czas słuchania w przeliczeniu na dni,
- czas słuchania podcastów,
- całkowitą liczbę odtworzeń muzyki i podcastów,
- średnią liczbę minut słuchania rocznie,
- średnią liczbę minut słuchania dziennie,
- liczbę unikalnych adresów IP,
- „najbardziej muzyczny dzień” wraz z liczbą przesłuchanych godzin.

> **Prywatność:** adresy IP są wykorzystywane do obliczeń statystycznych, ale nie są wyświetlane przez skrypt ani nigdzie udostępniane.

---

## 3. Charts

Sekcja **Charts** przedstawia statystyki w formie wykresów.

Możesz sprawdzić liczbę przesłuchanych minut w podziale na:

- **lata**,
- **miesiące w roku**,
- **dni tygodnia**,
- **godziny w ciągu dnia**,
- **platformy / urządzenia**.

Dzięki temu można zobaczyć nie tylko **ile** słuchasz, ale również **kiedy** najczęściej korzystasz ze Spotify.

---

## 4. Yearly Tops

Sekcja **Yearly Tops** przedstawia statystyki dla każdego roku osobno.

Dla każdego roku wyświetlane są:

- całkowity czas słuchania,
- liczba odtworzonych utworów,
- TOP utworów,
- TOP wykonawców,
- TOP albumów.

Dzięki temu możesz porównać swoje muzyczne preferencje między poszczególnymi latami.

---

## Kontakt

Jeśli chcesz się ze mną skontaktować albo coś nie działa poprawnie, napisz do mnie na Discordzie:

**`@uwu_dziewczynka`**

---

## Licencja

Nwm mam to gdzieś rób co chcesz i tak nie umiem pisać wiec baw się dobrze ale może nie będzie mi miło jak sie dowiem że zarobiłeś na tym 2137 zł
