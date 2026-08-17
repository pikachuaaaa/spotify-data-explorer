@echo off
title Node.js Installer
color 0A

echo ========================================
echo        Node.js Installer
echo ========================================
echo.

echo Sprawdzanie, czy Node.js jest juz zainstalowany...
node --version >nul 2>&1

if %errorlevel% equ 0 (
    echo.
    echo Node.js jest juz zainstalowany.
    echo Wersja:
    node --version
    echo.
    echo Nie trzeba nic instalowac.
    pause
    exit /b 0
)

echo Node.js nie zostal znaleziony.
echo.

echo Sprawdzanie dostepnosci winget...
winget --version >nul 2>&1

if %errorlevel% neq 0 (
    echo.
    echo BLAD: Nie znaleziono programu winget.
    echo.
    echo Winget jest standardowo dostepny w nowszych wersjach
    echo systemu Windows 10 i Windows 11.
    echo.
    echo Zainstaluj lub zaktualizuj "App Installer"
    echo ze sklepu Microsoft Store, a nastepnie uruchom ten
    echo plik ponownie.
    echo.
    pause
    exit /b 1
)

echo Winget znaleziony.
echo.
echo Rozpoczynanie instalacji Node.js LTS...
echo.

winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo Instalacja Node.js nie powiodla sie.
    echo ========================================
    echo.
    echo Sprobuj uruchomic ten plik ponownie
    echo jako administrator.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Node.js zostal zainstalowany!
echo ========================================
echo.
echo Zamknij ten terminal i otworz nowy,
echo aby system zaktualizowal zmienna PATH.
echo.
echo Nastepnie sprawdz instalacje poleceniem:
echo.
echo     node --version
echo.
pause