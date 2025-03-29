@echo off
echo Resolving merge conflicts by keeping local changes...

for /r %%f in (*.ts *.tsx *.js *.jsx *.json *.css *.scss *.html) do (
  findstr /m "<<<<<<<\|=======\|>>>>>>>" "%%f" >nul
  if not errorlevel 1 (
    echo Fixing %%f
    type "%%f" | findstr /v "^<<<<<<<\|^=======\|^>>>>>>>" > "%%f.tmp"
    move /y "%%f.tmp" "%%f"
  )
)

echo All conflicts resolved!
echo You can now commit your changes with:
echo git add .
echo git commit -m "Resolve merge conflicts by keeping local changes"