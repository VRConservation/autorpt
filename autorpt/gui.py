

# import dependencies
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
from tkinter import messagebox
import os
import autorpt
import traceback


def log_error(msg):
    try:
        with open("autorpt_gui.log", "a", encoding="utf-8") as f:
            f.write(msg + "\n")
    except Exception:
        pass


# basic root framework
root = ttk.Window(title="Autorpt GUI", themename="darkly")
root.title('Autorpt')
root.geometry('500x350')

# Define a custom style for buttons with larger bold font
style = ttk.Style()
style.configure('Custom.TButton', font=("Segoe UI", 14, "bold"))
# Define a custom style for the red PDF button with the same font
style.configure('DangerCustom.TButton', font=("Segoe UI", 14, "bold"),
                foreground='white', background=style.colors.danger)


# --- Button action functions ---
def word_report_action():
    generate_word_report()


def pdf_report_action():
    generate_pdf_report()


# --- Title and Subtitle ---
title_label = ttk.Label(
    root,
    text="Autorpt Generator",
    font=("Segoe UI", 20, "bold"),
    anchor="center"
)
title_label.pack(pady=(20, 5), fill="x")

subtitle_label = ttk.Label(
    root,
    text="Click on a button to generate a report",
    font=("Segoe UI", 12),
    anchor="center"
)
subtitle_label.pack(pady=(0, 20), fill="x")

# Word Report Button

word_button = ttk.Button(
    root,
    text="Word Report",
    bootstyle=SUCCESS,
    width=20,
    command=word_report_action,
    style='Custom.TButton'
)
word_button.pack(pady=20, fill="x", padx=40)

# PDF Report Button


pdf_button = ttk.Button(
    root,
    text="PDF Report",
    bootstyle=DANGER,
    width=20,
    command=pdf_report_action,
    style='DangerCustom.TButton'
)
pdf_button.pack(pady=20, fill="x", padx=40)


# --- Report generation functions ---

def generate_word_report():
    messagebox.showinfo("Debug", "Word report button pressed")
    try:
        log_error("Word report button clicked")
        rg = autorpt.ReportGenerator()
        rg.generate_report()
        messagebox.showinfo(
            "Success", f"Word report generated: {rg.output_file}")
    except Exception as e:
        log_error("Word report error: " + str(e) +
                  "\n" + traceback.format_exc())
        messagebox.showerror("Error", f"Failed to generate Word report: {e}")


def generate_pdf_report():
    messagebox.showinfo("Debug", "PDF report button pressed")
    try:
        log_error("PDF report button clicked")
        rg = autorpt.ReportGenerator()
        rg.generate_report()
        pdf_path = rg.rpt_pdf()
        if pdf_path:
            messagebox.showinfo("Success", f"PDF report generated: {pdf_path}")
        else:
            log_error("PDF conversion failed")
            messagebox.showerror("Error", "PDF conversion failed.")
    except Exception as e:
        log_error("PDF report error: " + str(e) +
                  "\n" + traceback.format_exc())
        messagebox.showerror("Error", f"Failed to generate PDF report: {e}")


# --- Button action functions ---
def word_report_action():
    generate_word_report()


def pdf_report_action():
    generate_pdf_report()


if __name__ == "__main__":
    root.mainloop()
