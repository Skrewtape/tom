from flask import Flask, request, send_from_directory
from app import App
import os

@App.route('/fonts/<path>')
def send_font(path):
        return send_from_directory('%s/fonts' % App.static_path, path)
