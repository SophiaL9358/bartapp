from flask import Flask, redirect, url_for, render_template
from datetime import date

app = Flask(__name__)

@app.route('/home')
def hello_admin():
   return render_template('home.html', today = date.today())


if __name__ == '__main__':
   app.run(debug = True)