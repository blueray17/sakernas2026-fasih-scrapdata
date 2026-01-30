@echo off
setlocal enabledelayedexpansion
echo Memproses file...
for %%F in (*.xlsx) do (
    set "filename=%%~nxF"
    
    REM Skip file batch script ini sendiri
    if /i not "%%~nxF"=="%~nx0" (
        REM Ambil 4 karakter pertama dari nama file
        set "foldername=!filename:~0,4!"
        
        REM Cek apakah folder sudah ada, jika belum buat folder baru
        if not exist "!foldername!" (
            mkdir "!foldername!"
            echo Membuat folder: !foldername!
        )
        
        REM Cek apakah file sudah ada di folder tujuan
        if exist "!foldername!\%%~nxF" (
            echo SKIP: %%F sudah ada di folder !foldername!
        ) else (
            REM Pindahkan file ke folder
            move "%%F" "!foldername!\" >nul
            echo Memindahkan: %%F ke folder !foldername!
        )
    )
)
echo.
echo Selesai!
pause