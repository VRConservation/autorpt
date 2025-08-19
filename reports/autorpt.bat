@echo off
REM Activate conda environment if needed:
REM call C:\Users\vance\miniconda3\Scripts\activate.bat agnt

REM Change directory to the autorpt package folder
cd /d "%~dp0..\autorpt"

REM Run the GUI
python gui.py
pause
